# Build locally and publish the static site through the shared Windows Caddy.
[CmdletBinding()]
param(
    [switch]$Rollback,
    [ValidatePattern('^[a-zA-Z0-9._-]+$')]
    [string]$SshHost = 'finprint-host'
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$Repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$RemoteRoot = 'C:\ProgramData\water-level-residual-ml'
$Domain = 'tides.ethanyanxu.com'
$Tar = Join-Path $env:SystemRoot 'System32\tar.exe'
$Curl = Join-Path $env:SystemRoot 'System32\curl.exe'
$archive = $null

function Invoke-Native([string]$File, [string[]]$Arguments) {
    # Windows PowerShell 5.1 treats native stderr as an error under Stop.
    $old = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try { & $File @Arguments | Out-Host; $code = $LASTEXITCODE }
    finally { $ErrorActionPreference = $old }
    if ($code -ne 0) { throw "$File failed (exit $code)." }
}

function Invoke-Remote([string]$Script) {
    $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($Script))
    Invoke-Native 'ssh.exe' @('-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', $SshHost,
        "powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -EncodedCommand $encoded")
}

function Get-Version {
    $sha = (& git rev-parse HEAD).Trim()
    if ($LASTEXITCODE -ne 0 -or $sha -notmatch '^[0-9a-f]{40}$') { throw 'Cannot determine the Git commit.' }
    $dirty = & git status --porcelain
    if ($LASTEXITCODE -ne 0) { throw 'Cannot check the working tree.' }
    if ($dirty) { throw 'Commit or stash changes before deploying; production must identify a clean commit.' }
    return $sha
}

function Test-Public([string]$Expected) {
    $deadline = (Get-Date).AddSeconds(120)
    do {
        $old = $ErrorActionPreference
        $ErrorActionPreference = 'Continue'
        try {
            $got = & $Curl --silent --show-error --fail --max-time 10 --ssl-revoke-best-effort "https://$Domain/version.txt" 2>$null
            $code = $LASTEXITCODE
        } finally { $ErrorActionPreference = $old }
        if ($code -eq 0 -and "$got".Trim() -eq $Expected) { return }
        Start-Sleep -Seconds 3
    } while ((Get-Date) -lt $deadline)
    throw "The host passed verification, but public HTTPS is not serving $Expected. Check DNS for $Domain."
}

try {
    Push-Location $Repo
    if ($Rollback) {
        Invoke-Remote "& '$RemoteRoot\host.ps1' -Rollback; exit `$LASTEXITCODE"
        # Read the host's confirmed release, then independently verify public DNS.
        $script = "Get-Content -LiteralPath (Join-Path '$RemoteRoot\releases' ((Get-Content '$RemoteRoot\state.json' -Raw | ConvertFrom-Json).active + '\version.txt'))"
        $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($script))
        $old = $ErrorActionPreference
        $ErrorActionPreference = 'Continue'
        try {
            $version = & ssh.exe -o BatchMode=yes -o ConnectTimeout=10 $SshHost "powershell -NoProfile -NonInteractive -EncodedCommand $encoded" 2>$null
            $code = $LASTEXITCODE
        } finally { $ErrorActionPreference = $old }
        if ($code -ne 0 -or "$version".Trim() -notmatch '^[0-9a-f]{40}$') { throw 'Cannot read the rollback version.' }
        Test-Public ("$version".Trim())
        Write-Host "Rollback verified at https://$Domain"
        exit 0
    }

    $version = Get-Version
    Write-Host "Building commit $version"
    Invoke-Native 'npm.cmd' @('ci', '--no-audit', '--no-fund')
    Invoke-Native 'npm.cmd' @('run', 'lint')
    Invoke-Native 'npm.cmd' @('run', 'build')
    if ((Get-Version) -ne $version) { throw 'The source changed during the build; deploy again.' }
    if (-not (Test-Path -LiteralPath 'out\index.html')) { throw 'The static export is missing out/index.html.' }
    [IO.File]::WriteAllText((Join-Path $Repo 'out\version.txt'), $version, (New-Object Text.UTF8Encoding $false))
    $archive = Join-Path $env:TEMP ('water-level-residual-ml-' + [Guid]::NewGuid().ToString('N') + '.tgz')
    Invoke-Native $Tar @('-czf', $archive, '-C', (Join-Path $Repo 'out'), '.')

    # Only administrators and SYSTEM may change configuration imported by Caddy.
    Invoke-Remote @"
`$ErrorActionPreference = 'Stop'
New-Item -ItemType Directory -Force -Path '$RemoteRoot' | Out-Null
& icacls.exe '$RemoteRoot' /inheritance:r /grant:r '*S-1-5-18:(OI)(CI)F' '*S-1-5-32-544:(OI)(CI)F' | Out-Null
if (`$LASTEXITCODE -ne 0) { exit 1 }
New-Item -ItemType Directory -Force -Path '$RemoteRoot\incoming' | Out-Null
"@
    $remoteDir = $RemoteRoot -replace '\\', '/'
    $upload = "$remoteDir/incoming/$([IO.Path]::GetFileName($archive))"
    Invoke-Native 'scp.exe' @('-q', '-o', 'BatchMode=yes', (Join-Path $PSScriptRoot 'host.ps1'), "${SshHost}:$remoteDir/host.ps1")
    Invoke-Native 'scp.exe' @('-q', '-o', 'BatchMode=yes', $archive, "${SshHost}:$upload")
    Invoke-Remote "& '$RemoteRoot\host.ps1' -Archive '$upload' -Version '$version'; exit `$LASTEXITCODE"
    Test-Public $version
    Write-Host "Deployed $version to https://$Domain"
} catch {
    Write-Host "Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    if ($archive -and (Test-Path -LiteralPath $archive)) { Remove-Item -LiteralPath $archive -Force }
    Pop-Location
}
