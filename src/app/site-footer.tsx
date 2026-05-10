import Link from "next/link";

export default function SiteFooter(props: { contactEmail?: string }) {
  return (
    <footer className="relative">
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-10">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="text-sm font-semibold tracking-tight">Milodo Medical Group</div>
              <div className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
                Betriebliche Erste-Hilfe-Ausbildung und Notfalltrainings für Arztpraxen sowie Pflegeeinrichtungen – in
                NRW.
              </div>
              {props.contactEmail ? (
                <div className="mt-4 text-sm">
                  <a
                    className="font-mono text-[color:var(--muted)] underline decoration-[color-mix(in_oklab,var(--accent)_55%,transparent)] underline-offset-4 hover:text-[var(--foreground)]"
                    href={`mailto:${props.contactEmail}`}
                  >
                    {props.contactEmail}
                  </a>
                </div>
              ) : null}
            </div>

            <div className="grid items-start gap-8 sm:grid-cols-2 md:col-span-7 md:grid-cols-3">
              <div className="grid content-start gap-3 text-sm leading-6">
                <div className="font-semibold leading-6 tracking-tight">Information</div>
                <Link className="text-[color:var(--muted)] hover:text-[var(--foreground)]" href="/#leistungen">
                  Leistungen
                </Link>
                <Link className="text-[color:var(--muted)] hover:text-[var(--foreground)]" href="/#ablauf">
                  Ablauf
                </Link>
                <Link className="text-[color:var(--muted)] hover:text-[var(--foreground)]" href="/#kunden">
                  Kunden
                </Link>
                <Link className="text-[color:var(--muted)] hover:text-[var(--foreground)]" href="/beitraege">
                  Beiträge
                </Link>
              </div>

              <div className="grid content-start gap-3 text-sm leading-6">
                <div className="font-semibold leading-6 tracking-tight">Sonstiges</div>
                <Link className="text-[color:var(--muted)] hover:text-[var(--foreground)]" href="/impressum">
                  Impressum
                </Link>
                <Link className="text-[color:var(--muted)] hover:text-[var(--foreground)]" href="/datenschutz">
                  Datenschutz
                </Link>
                <Link className="text-[color:var(--muted)] hover:text-[var(--foreground)]" href="/agb">
                  AGB
                </Link>
              </div>

              <div className="grid content-start gap-3 text-sm leading-6">
                <div className="font-semibold leading-6 tracking-tight">Portal</div>
                <a
                  className="text-[color:var(--muted)] hover:text-[var(--foreground)]"
                  href="https://app.milodo-medical.de"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Zum Portal
                </a>
                <Link className="text-[color:var(--muted)] hover:text-[var(--foreground)]" href="/#top">
                  Nach oben
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-[var(--border)] pt-6 text-sm text-[color:var(--muted)] md:flex-row md:items-center md:justify-between">
            <div>© Milodo Medical Group</div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link className="hover:text-[var(--foreground)]" href="/beitraege">
                Alle Beiträge
              </Link>
              <Link className="hover:text-[var(--foreground)]" href="/cookies">
                Cookie‑Info
              </Link>
              <Link className="hover:text-[var(--foreground)]" href="/impressum">
                Impressum
              </Link>
              <Link className="hover:text-[var(--foreground)]" href="/datenschutz">
                Datenschutz
              </Link>
              <Link className="hover:text-[var(--foreground)]" href="/agb">
                AGB
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
