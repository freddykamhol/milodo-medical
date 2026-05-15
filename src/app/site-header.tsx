import Image from "next/image";
import Link from "next/link";

export default function SiteHeader(props: { variant?: "home" | "page" }) {
  const variant = props.variant ?? "page";
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/78 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link href="/" className="inline-flex items-center py-1">
          <Image
            src="/logo/MILODO.png"
            alt="Milodo Medical Group"
            width={160}
            height={160}
            priority={variant === "home"}
            className="h-9 w-auto object-contain sm:h-10"
          />
        </Link>

        <nav
          aria-label="Navigation"
          className="hidden items-center gap-8 text-sm font-medium text-[color:var(--muted)] md:flex"
        >
          <Link className="hover:text-[var(--foreground)]" href="/#leistungen">
            Leistungen
          </Link>
          <Link className="hover:text-[var(--foreground)]" href="/#bilder">
            Bilder
          </Link>
          <Link className="hover:text-[var(--foreground)]" href="/#ablauf">
            Ablauf
          </Link>
          <Link className="hover:text-[var(--foreground)]" href="/#kunden">
            Kunden
          </Link>
          <Link className="hover:text-[var(--foreground)]" href="/beitraege">
            Beiträge
          </Link>
        </nav>

        <Link
          className="inline-flex items-center justify-center rounded-2xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow)] hover:opacity-90"
          href="/#kontakt"
        >
          Anfrage
        </Link>
      </div>
    </header>
  );
}
