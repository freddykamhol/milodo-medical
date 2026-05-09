import { legalEntityFromEnv } from "@/lib/legal";

export default function ImpressumPage() {
  const legal = legalEntityFromEnv();

  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">Impressum</h1>

        <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
          Pflichtangaben nach § 5 DDG (vormals § 5 TMG) und § 18 Abs. 2 MStV. Bitte ergänze fehlende Angaben (mit „—“
          gekennzeichnet) vor dem Launch.
        </p>

        <section className="mt-10 grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Anbieter</h2>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="font-semibold text-[var(--foreground)]">
              {legal.companyName ?? "— Firmenname (NEXT_PUBLIC_COMPANY_NAME)"}
              {legal.legalForm ? ` · ${legal.legalForm}` : ""}
            </div>
            <div className="mt-1 whitespace-pre-line">
              {legal.address ?? "— Anschrift (NEXT_PUBLIC_COMPANY_ADDRESS)"}
            </div>
            <div className="mt-3 grid gap-1">
              <div>E-Mail: {legal.email ?? "— (NEXT_PUBLIC_CONTACT_EMAIL)"}</div>
              <div>Telefon: {legal.phone ?? "— (NEXT_PUBLIC_COMPANY_PHONE)"}</div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-2 text-sm leading-relaxed text-[color:var(--muted)]">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Vertretungsberechtigte Person(en)</h2>
          <p>{legal.representative ?? "— (NEXT_PUBLIC_COMPANY_REPRESENTATIVE)"}</p>
        </section>

        <section className="mt-10 grid gap-2 text-sm leading-relaxed text-[color:var(--muted)]">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Registereintrag</h2>
          <p>{legal.register ?? "— (NEXT_PUBLIC_COMPANY_REGISTER, optional)"}</p>
        </section>

        <section className="mt-10 grid gap-2 text-sm leading-relaxed text-[color:var(--muted)]">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Umsatzsteuer</h2>
          <p>USt-IdNr.: {legal.vatId ?? "— (NEXT_PUBLIC_COMPANY_VAT_ID, optional)"}</p>
        </section>

        <section className="mt-10 grid gap-2 text-sm leading-relaxed text-[color:var(--muted)]">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Aufsichtsbehörde (falls zutreffend)</h2>
          <p>{legal.supervisoryAuthority ?? "— (NEXT_PUBLIC_COMPANY_SUPERVISORY_AUTHORITY, optional)"}</p>
        </section>
      </div>
    </main>
  );
}
