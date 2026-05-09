import Link from "next/link";

type TocItem = {
  href: string;
  label: string;
};

export default function LegalPage(props: {
  title: string;
  lead?: string;
  toc?: TocItem[];
  children: React.ReactNode;
}) {
  return (
    <main className="relative bg-[var(--background)] text-[var(--foreground)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-56 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-[0.10] blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,color-mix(in_oklab,var(--foreground)_10%,transparent)_1px,transparent_0)] [background-size:18px_18px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-10 md:pt-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)] shadow-[var(--shadow)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Rechtliches
          </div>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            {props.title}
          </h1>
          {props.lead ? (
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
              {props.lead}
            </p>
          ) : null}
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-12">
          {props.toc?.length ? (
            <aside className="md:col-span-4">
              <div className="sticky top-[calc(var(--scroll-offset)+18px)] rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
                <div className="text-xs font-semibold tracking-tight text-[color:var(--muted)]">
                  Inhalt
                </div>
                <nav className="mt-3 grid gap-2 text-sm">
                  {props.toc.map((item) => (
                    <a
                      key={item.href}
                      className="text-[color:var(--muted)] hover:text-[var(--foreground)]"
                      href={item.href}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-4 border-t border-[var(--border)] pt-4 text-xs text-[color:var(--muted)]">
                  <Link className="hover:text-[var(--foreground)]" href="/#kontakt">
                    Kontakt aufnehmen
                  </Link>
                </div>
              </div>
            </aside>
          ) : null}

          <div className={props.toc?.length ? "md:col-span-8" : "md:col-span-12"}>
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] md:p-8">
              <div className="grid gap-8">{props.children}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

