import type { ReactNode } from "react";

export function Section({
  id,
  numeral,
  title,
  kicker,
  children,
}: {
  id: string;
  numeral?: string;
  title: string;
  kicker?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-14 sm:py-16">
      <header className="mb-8">
        {kicker && (
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent">
            {kicker}
          </p>
        )}
        <h2 className="flex items-baseline gap-3 font-serif text-[1.75rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]">
          {numeral && (
            <span aria-hidden className="num text-base font-normal text-muted">
              {numeral}.
            </span>
          )}
          {title}
        </h2>
        <div className="rule-gradient mt-5 h-px w-full" />
      </header>
      {children}
    </section>
  );
}

export function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 mt-10 font-serif text-[1.2rem] font-semibold text-ink first:mt-0">
      {children}
    </h3>
  );
}

export function Callout({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <aside className="my-8 rounded-xl border border-border-base bg-surface-2 p-5 sm:p-6">
      <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent">
        {label}
      </p>
      <div className="text-[0.95rem] leading-relaxed text-ink-2">{children}</div>
    </aside>
  );
}
