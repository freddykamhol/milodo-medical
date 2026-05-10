import { legalEntityFromEnv } from "@/lib/legal";
import LegalPage from "@/app/components/legal-page";

export default function ImpressumPage() {
  const legal = legalEntityFromEnv();

  return (
    <LegalPage
      title="Impressum"
      lead="Pflichtangaben nach § 5 DDG und § 18 Abs. 2 MStV. Bitte ergänze fehlende Angaben (mit „—“ gekennzeichnet) vor dem Launch. Tipp: In Umgebungsvariablen kann die Anschrift mit \"\\n\" umgebrochen werden."
      toc={[
        { href: "#anbieter", label: "Anbieter" },
        { href: "#vertretung", label: "Vertretung" },
        { href: "#ust", label: "USt-IdNr." },
      ]}
    >
      <section id="anbieter" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">Anbieter</h2>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
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

      <section id="vertretung" className="grid gap-2 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">Vertretungsberechtigte Person(en)</h2>
        <p>{legal.representative ?? "— (NEXT_PUBLIC_COMPANY_REPRESENTATIVE)"}</p>
      </section>

      <section id="ust" className="grid gap-2 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">Umsatzsteuer</h2>
        <p>USt-IdNr.: {legal.vatId ?? "— (NEXT_PUBLIC_COMPANY_VAT_ID, optional)"}</p>
      </section>
    </LegalPage>
  );
}
