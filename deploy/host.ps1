<#
    host.ps1 - activate a water-level-residual-ml release on finprint-host.

    deploy.ps1 uploads this file with each release and runs it over SSH; there
    is no reason to run it by hand. Windows PowerShell 5.1, elevated.

    The site is plain files (next build, output: "export"), so nothing runs for
    it here: finprint's Caddy, which already owns 80/443 for every site on this
    machine, serves the active release directly. This script plugs it in the
    same way the other co-hosted sites do - a "# BEGIN <name> (managed)" import
    block in finprint's Caddyfile pointing at a Caddyfile of our own.

        C:\ProgramData\water-level-residual-ml\
            Caddyfile            site block, rewritten on every activation
            state.json           which release is active, and the one before it
            releases\<stamp>\    built files, one directory per deploy
            incoming\            uploads from deploy.ps1
            logs\                access log, caddy validate/reload output, backups

    A release counts as deployed only once https://<domain>/version.txt, fetched
    through Caddy with a publicly trusted certificate, returns its commit. If
    that never happens and an earlier release exists, Caddy is pointed back at
    the earlier one before failing.
#>

[CmdletBinding()]
param(
    [string]$Archive,
    [string]$Version,
    [switch]$Rollback,
    [string]$Domain = 'tides.ethanyanxu.com',
    [string]$Root = 'C:\ProgramData\water-level-residual-ml',
    [string]$CaddyExe = 'C:\Users\ethan\AppData\Local\Microsoft\WinGet\Links\caddy.exe',
    [string]$MainCaddyfile = 'C:\Users\ethan\finprint\scripts\selfhost\Caddyfile'
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$Releases = Join-Path $Root 'releases'
$Incoming = Join-Path $Root 'incoming'
$Logs = Join-Path $Root 'logs'
$SiteFile = Join-Path $Root 'Caddyfile'
$StateFile = Join-Path $Root 'state.json'
$Tar = Join-Path $env:SystemRoot 'System32\tar.exe'
$Curl = Join-Path $env:SystemRoot 'System32\curl.exe'
$Utf8 = New-Object Text.UTF8Encoding $false
$BeginMarker = '# BEGIN water-level-residual-ml (managed)'
$EndMarker = '# END water-level-residual-ml (managed)'
$ReleasePattern = '^\d{14}-[0-9a-f]{12}$'
$lock = $null
$activated = $false

function Info($m) { Write-Host "    $m" }
function Good($m) { Write-Host "    $m" -ForegroundColor Green }

# Native tools report through exit codes. Under 'Stop', Windows PowerShell 5.1
# turns anything they print on stderr into a terminating error, so run them
# under 'Continue' and judge the exit code instead.
function Invoke-Native([string]$File, [string[]]$Arguments) {
    $old = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $output = & $File @Arguments 2>&1 | ForEach-Object { "$_" } | Out-String
        $code = $LASTEXITCODE
    } finally { $ErrorActionPreference = $old }
    return [pscustomobject]@{ Code = $code; Output = $output.Trim() }
}

function Invoke-Caddy([string]$Verb) {
    $r = Invoke-Native $CaddyExe @($Verb, '--config', $MainCaddyfile, '--adapter', 'caddyfile')
    $log = Join-Path $Logs 'caddy-reload.log'
    [IO.File]::AppendAllText($log, ("[{0}] caddy {1} -> {2}`r`n{3}`r`n" -f (Get-Date -Format s), $Verb, $r.Code, $r.Output), $Utf8)
    if ($r.Code -ne 0) { throw "caddy $Verb failed ($($r.Code)):`n$($r.Output)" }
}

function Read-State {
    if (Test-Path -LiteralPath $StateFile) {
        $s = Get-Content -LiteralPath $StateFile -Raw | ConvertFrom-Json
        return [pscustomobject]@{ active = $s.active; previous = $s.previous }
    }
    return [pscustomobject]@{ active = $null; previous = $null }
}

function Save-State([string]$Active, [string]$Previous) {
    $json = [pscustomobject]@{ active = $Active; previous = $Previous } | ConvertTo-Json
    [IO.File]::WriteAllText("$StateFile.tmp", $json, $Utf8)
    Move-Item -LiteralPath "$StateFile.tmp" -Destination $StateFile -Force
}

function Test-Release([string]$Name) {
    return $Name -and $Name -match $ReleasePattern -and (Test-Path -LiteralPath (Join-Path $Releases "$Name\index.html"))
}

function Get-ReleaseVersion([string]$Name) {
    return ([IO.File]::ReadAllText((Join-Path $Releases "$Name\version.txt"))).Trim()
}

function Write-SiteConfig([string]$Name) {
    $rootPath = (Join-Path $Releases $Name) -replace '\\', '/'
    $logPath = (Join-Path $Logs 'access.log') -replace '\\', '/'
    $text = @"
# Written by water-level-residual-ml deploy/host.ps1 on every deploy - edit that, not this.
$Domain {
	root * "$rootPath"
	encode zstd gzip

	header {
		# Vercel sent this; browsers that visited before have it pinned anyway.
		Strict-Transport-Security "max-age=63072000"
		X-Content-Type-Options "nosniff"
		X-Tides-Host "finprint-host"
	}
	# Build output under /_next/static/ is content-hashed, so it never changes.
	@hashed path /_next/static/*
	header @hashed Cache-Control "public, max-age=31536000, immutable"
	@unhashed not path /_next/static/*
	header @unhashed Cache-Control "public, max-age=0, must-revalidate"

	try_files {path} {path}.html {path}/ =404
	file_server

	handle_errors 404 {
		rewrite * /404.html
		file_server
	}

	log {
		output file "$logPath" {
			roll_size 10MB
			roll_keep 3
		}
	}
}
"@
    [IO.File]::WriteAllText($SiteFile, $text, $Utf8)
}

# Point Caddy at release $Name. A failed validate or reload restores both
# Caddyfiles; a reload that fails leaves Caddy running its previous config, so
# the other sites on this server are never affected.
function Set-ActiveRelease([string]$Name) {
    $oldMain = [IO.File]::ReadAllText($MainCaddyfile)
    $oldSite = if (Test-Path -LiteralPath $SiteFile) { [IO.File]::ReadAllText($SiteFile) } else { $null }
    $newMain = $oldMain
    if (-not $oldMain.Contains($BeginMarker)) {
        $import = $SiteFile -replace '\\', '/'
        $newMain = $oldMain.TrimEnd() + "`r`n`r`n$BeginMarker`r`nimport $import`r`n$EndMarker`r`n"
    }
    try {
        if ($newMain -ne $oldMain) {
            Copy-Item -LiteralPath $MainCaddyfile -Destination (Join-Path $Logs ('Caddyfile-before-' + (Get-Date -Format yyyyMMddHHmmss)))
            [IO.File]::WriteAllText($MainCaddyfile, $newMain, $Utf8)
            Info "added the water-level-residual-ml import to $MainCaddyfile (backup in $Logs)"
        }
        Write-SiteConfig $Name
        Invoke-Caddy 'validate'
        Invoke-Caddy 'reload'
    } catch {
        if ($newMain -ne $oldMain) { [IO.File]::WriteAllText($MainCaddyfile, $oldMain, $Utf8) }
        if ($null -ne $oldSite) { [IO.File]::WriteAllText($SiteFile, $oldSite, $Utf8) }
        else { Remove-Item -LiteralPath $SiteFile -Force -ErrorAction SilentlyContinue }
        try { Invoke-Caddy 'reload' } catch { }
        throw
    }
}

# Fetch version.txt through Caddy on this machine, by name, with certificate
# verification on. Success therefore proves the route, the files, and a valid
# certificate together. --resolve keeps the check independent of router
# hairpinning and of whatever DNS currently says.
function Wait-Serving([string]$Expected, [int]$Seconds) {
    $deadline = (Get-Date).AddSeconds($Seconds)
    $last = ''
    do {
        $r = Invoke-Native $Curl @('--silent', '--show-error', '--fail', '--max-time', '10',
            '--ssl-revoke-best-effort', '--resolve', "${Domain}:443:127.0.0.1", "https://$Domain/version.txt")
        if ($r.Code -eq 0 -and $r.Output -eq $Expected) { return $true }
        $last = if ($r.Code -eq 0) { "serving $($r.Output)" } else { $r.Output }
        Start-Sleep -Seconds 3
    } while ((Get-Date) -lt $deadline)
    Info "last answer: $last"
    return $false
}

try {
    if ($Domain -ne 'tides.ethanyanxu.com') { throw 'This script manages only tides.ethanyanxu.com.' }
    $admin = (New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
        ).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    if (-not $admin) { throw 'Run elevated: this rewrites the SYSTEM Caddy configuration.' }
    foreach ($p in $CaddyExe, $MainCaddyfile) {
        if (-not (Test-Path -LiteralPath $p)) { throw "Not found: $p" }
    }
    New-Item -ItemType Directory -Force -Path $Releases, $Incoming, $Logs | Out-Null
    $lock = [IO.File]::Open((Join-Path $Root 'deploy.lock'), 'OpenOrCreate', 'ReadWrite', 'None')
    $state = Read-State
    $originalMain = [IO.File]::ReadAllText($MainCaddyfile)
    $originalSite = if (Test-Path -LiteralPath $SiteFile) { [IO.File]::ReadAllText($SiteFile) } else { $null }

    if ($Rollback) {
        if (-not (Test-Release $state.previous)) { throw 'There is no previous release to roll back to.' }
        $target = $state.previous
        $expected = Get-ReleaseVersion $target
        Info "rolling back: $($state.active) -> $target"
    } else {
        if ($Version -notmatch '^[0-9a-f]{40}$') { throw "Bad -Version '$Version'." }
        $archivePath = [IO.Path]::GetFullPath($Archive)
        if (-not $archivePath.StartsWith($Incoming + '\', [StringComparison]::OrdinalIgnoreCase) -or
            -not (Test-Path -LiteralPath $archivePath)) {
            throw "Archive must be an uploaded file under $Incoming."
        }
        $target = '{0}-{1}' -f (Get-Date -Format yyyyMMddHHmmss), $Version.Substring(0, 12)
        $dir = Join-Path $Releases $target
        New-Item -ItemType Directory -Path $dir | Out-Null
        $r = Invoke-Native $Tar @('-xzf', $archivePath, '-C', $dir)
        if ($r.Code -ne 0) {
            throw "tar failed ($($r.Code)): $($r.Output)"
        }
        Remove-Item -LiteralPath $archivePath -Force
        if (-not (Test-Release $target) -or (Get-ReleaseVersion $target) -ne $Version) {
            throw "Release $target is incomplete (no index.html, or version.txt does not say $Version)."
        }
        foreach ($file in '404.html', 'xu-water-level-residual-correction-cjsj-v11.pdf',
            'figures/fig1-lightgbm-feature-importance.png', 'figures/fig2-xgboost-feature-importance.png',
            'figures/fig3-lightgbm-onestep.png', 'figures/fig4-xgboost-onestep.png',
            'figures/fig5-lightgbm-autoregressive.png', 'figures/fig6-xgboost-autoregressive.png') {
            if (-not (Test-Path -LiteralPath (Join-Path $dir $file) -PathType Leaf)) {
                throw "Release is missing $file."
            }
        }
        $expected = $Version
        Info "unpacked release $target"
    }

    Set-ActiveRelease $target
    $activated = $true
    Info "Caddy reloaded; waiting for https://$Domain to serve $($expected.Substring(0, 12)) ..."

    # With an earlier release the certificate already exists and the switch is
    # near-instant. On the first deploy Caddy still has to obtain one.
    $fallback = if ($state.active -ne $target -and (Test-Release $state.active)) { $state.active } else { $null }
    $wait = if ($fallback) { 30 } else { 240 }
    if (Wait-Serving $expected $wait) {
        Save-State $target $(if ($state.active -ne $target) { $state.active } else { $state.previous })
        Good "https://$Domain is serving release $target"
        exit 0
    }

    throw "Release $target did not pass HTTPS verification. Check DNS and the shared Caddy log."
} catch {
    if ($activated) {
        # Restore our import while preserving other sites added in the meantime.
        if (-not $originalMain.Contains($BeginMarker)) {
            $main = [IO.File]::ReadAllText($MainCaddyfile)
            $pattern = '(?s)' + [regex]::Escape($BeginMarker) + '.*?' + [regex]::Escape($EndMarker)
            [IO.File]::WriteAllText($MainCaddyfile, ([regex]::Replace($main, $pattern, '')), $Utf8)
        }
        if ($null -ne $originalSite) { [IO.File]::WriteAllText($SiteFile, $originalSite, $Utf8) }
        else { Remove-Item -LiteralPath $SiteFile -Force -ErrorAction SilentlyContinue }
        try { Invoke-Caddy 'reload'; Info 'Restored the previous Caddy configuration.' }
        catch { Write-Host "Caddy restoration failed: $($_.Exception.Message)" }
    }
    # Write-Host reaches deploy.ps1 on stdout; see Invoke-Remote there.
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    if ($lock) { $lock.Dispose() }
}
