import LegalPage from "@/app/components/legal-page";

export default function AgbPage() {
  return (
    <LegalPage
      title="Allgemeine Geschäftsbedingungen"
      lead="Hinweis: Bitte hinterlege hier vor dem Launch eure verbindlichen AGB oder entferne den Menüpunkt, falls keine AGB verwendet werden."
    >
      <section className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="text-sm font-semibold tracking-tight text-[var(--foreground)]">Platzhalter</div>
          <p className="mt-2">
            Diese Seite ist aktuell ein Platzhalter. Wenn ihr AGB nutzt, fügt den vollständigen Text hier ein (oder
            verlinkt rechtskonform auf die AGB, sofern ihr sie an anderer Stelle bereitstellt).
          </p>
        </div>
      </section>
    </LegalPage>
  );
}
