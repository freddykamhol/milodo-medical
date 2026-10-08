import { legalEntityFromEnv } from "@/lib/legal";
import LegalPage from "@/app/components/legal-page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ImpressumPage() {
  const legal = legalEntityFromEnv();

  return (
    <LegalPage
      title="Impressum"
      lead="Pflichtangaben nach § 5 DDG und § 18 Abs. 2 MStV."
      toc={[
        { href: "#anbieter", label: "Anbieter" },
        { href: "#vertretung", label: "Vertretung" },
      ]}
    >
      <section id="anbieter" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">Anbieter</h2>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="font-semibold text-[var(--foreground)]">
            {legal.companyName ?? "—"}
            {legal.legalForm ? ` · ${legal.legalForm}` : ""}
          </div>
          <div className="mt-1 whitespace-pre-line">
            {legal.address ?? "—"}
          </div>
          <div className="mt-3 grid gap-1">
            <div>E-Mail: {legal.email ?? "—"}</div>
            <div>Telefon: {legal.phone ?? "—"}</div>
          </div>
        </div>
      </section>

      <section id="vertretung" className="grid gap-2 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">Vertretungsberechtigte Person(en)</h2>
        <p>{legal.representative ?? "—"}</p>
      </section>

    </LegalPage>
  );
}
