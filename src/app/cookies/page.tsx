import LegalPage from "@/app/components/legal-page";
import OpenCookieSettingsButton from "./open-settings-button";

export default function CookieInfoPage() {
  return (
    <LegalPage
      title="Cookie‑Info"
      lead="Hier findest du Informationen zu Cookies und ähnlichen Technologien auf dieser Website sowie eine Möglichkeit, deine Einwilligung zu verwalten."
      toc={[
        { href: "#ueberblick", label: "Überblick" },
        { href: "#kategorien", label: "Kategorien" },
        { href: "#liste", label: "Cookie‑Liste" },
        { href: "#einstellungen", label: "Einstellungen" },
      ]}
    >
      <section id="ueberblick" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">1. Überblick</h2>
        <p>
          Wir verwenden technisch notwendige Cookies, damit die Website funktioniert. Optional können funktionale Cookies
          aktiviert werden (z.B. Spam‑Schutz für Formulare). Tracking‑ und Marketing‑Cookies setzen wir derzeit nicht
          ein.
        </p>
      </section>

      <section id="kategorien" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">2. Kategorien</h2>
        <div className="grid gap-3">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
            <div className="font-semibold text-[var(--foreground)]">Notwendig</div>
            <div className="mt-2">
              Erforderlich für grundlegende Funktionen (z.B. Seitennavigation, Sicherheitsfeatures). Immer aktiv.
            </div>
          </div>
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
            <div className="font-semibold text-[var(--foreground)]">Funktional</div>
            <div className="mt-2">
              Zusätzliche Funktionen, z.B. Spam‑Schutz (reCAPTCHA) für Formulare. Kann in den Einstellungen aktiviert
              oder deaktiviert werden.
            </div>
          </div>
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
            <div className="font-semibold text-[var(--foreground)]">Analyse / Marketing</div>
            <div className="mt-2">
              Derzeit nicht genutzt. Falls künftig Analyse‑ oder Marketingdienste eingebunden werden, erfolgt dies nur
              nach Einwilligung.
            </div>
          </div>
        </div>
      </section>

      <section id="liste" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">3. Cookie‑Liste</h2>
        <p>
          Diese Website setzt derzeit keine eigenen Tracking‑ oder Marketing‑Cookies. Technisch notwendige Cookies können
          durch Hosting/Framework im Rahmen der Auslieferung entstehen (z.B. Session‑/Caching‑Mechanismen).
        </p>
        <p>
          Bei aktivierten funktionalen Cookies kann für das Kontaktformular reCAPTCHA eingebunden werden. In diesem Fall
          erfolgt ein Abruf von Ressourcen von Google (externer Dienst).
        </p>
      </section>

      <section id="einstellungen" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">4. Einstellungen</h2>
        <p>Du kannst deine Einwilligung jederzeit anpassen. Die Auswahl wird für 4 Wochen gespeichert.</p>
        <div>
          <OpenCookieSettingsButton />
        </div>
      </section>
    </LegalPage>
  );
}

