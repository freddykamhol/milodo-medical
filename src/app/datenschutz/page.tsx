import { legalEntityFromEnv } from "@/lib/legal";
import LegalPage from "@/app/components/legal-page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DatenschutzPage() {
  const legal = legalEntityFromEnv();
  const lastUpdated = String(process.env.NEXT_PUBLIC_PRIVACY_LAST_UPDATED ?? "").trim() || "—";
  const portalUrl = (process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://app.milodo-medical.de").replace(/\/+$/g, "");
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim() || "—";

  return (
    <LegalPage
      title="Datenschutzerklärung"
      lead="Diese Datenschutzerklärung informiert über die Verarbeitung personenbezogener Daten beim Besuch dieser Website. Bitte ergänze fehlende Angaben (mit „—“ gekennzeichnet) vor dem Launch."
      toc={[
        { href: "#verantwortlicher", label: "Verantwortlicher" },
        { href: "#zwecke", label: "Zwecke & Rechtsgrundlagen" },
        { href: "#logs", label: "Server-Logfiles" },
        { href: "#kontakt", label: "Kontaktformular" },
        { href: "#cookies", label: "Cookies/Einwilligung" },
        { href: "#recaptcha", label: "reCAPTCHA" },
        { href: "#empfaenger", label: "Empfänger" },
        { href: "#drittland", label: "Drittlandtransfer" },
        { href: "#speicher", label: "Speicherdauer" },
        { href: "#rechte", label: "Deine Rechte" },
        { href: "#stand", label: "Stand" },
      ]}
    >
      <section id="verantwortlicher" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">1. Verantwortlicher</h2>
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
        <div>
          Soweit ein Datenschutzbeauftragter bestellt ist, lautet die Kontaktadresse:{" "}
          <span className="font-mono">{legal.dpoContact ?? "— (NEXT_PUBLIC_DPO_CONTACT, optional)"}</span>
        </div>
      </section>

      <section id="zwecke" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">2. Zwecke und Rechtsgrundlagen</h2>
        <p>
          Wir verarbeiten personenbezogene Daten nur, soweit dies erforderlich ist. Die wichtigsten Zwecke und
          Rechtsgrundlagen sind:
        </p>
        <ul className="list-disc pl-5">
          <li>
            Bereitstellung der Website, IT-Sicherheit und Fehleranalyse (Art. 6 Abs. 1 lit. f DSGVO – berechtigtes
            Interesse).
          </li>
          <li>
            Kontaktaufnahme und Bearbeitung von Anfragen (Art. 6 Abs. 1 lit. b DSGVO – vorvertragliche Maßnahmen / Vertrag
            bzw. Art. 6 Abs. 1 lit. f DSGVO).
          </li>
          <li>
            Einwilligungen (z.B. Laden optionaler Funktionen wie Bot-Schutz) (Art. 6 Abs. 1 lit. a DSGVO; für das Setzen
            von Cookies/ähnlichen Technologien zusätzlich § 25 TTDSG).
          </li>
        </ul>
      </section>

      <section id="logs" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">3. Zugriffsdaten / Server-Logfiles</h2>
        <p>
          Beim Aufruf der Website verarbeitet der Hosting-Provider technisch notwendige Informationen (z.B. IP-Adresse,
          Datum/Uhrzeit, angeforderte Seite, User-Agent), um die Auslieferung der Website zu ermöglichen sowie Angriffe
          zu erkennen und abzuwehren. Eine Zusammenführung dieser Daten mit anderen Datenquellen findet nicht statt.
        </p>
        <p>
          Die Speicherdauer der Logfiles richtet sich nach den Einstellungen des Hosting-Providers und wird nur so lange
          vorgehalten, wie es für Betrieb und Sicherheit erforderlich ist.
        </p>
      </section>

      <section id="kontakt" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">4. Kontaktformular</h2>
        <p>
          Wenn du uns über das Kontaktformular kontaktierst, werden die von dir eingegebenen Angaben (z.B. Name,
          Kontaktdaten, Nachricht und ggf. Leistungsdetails) zum Zweck der Bearbeitung der Anfrage verarbeitet.
        </p>
        <p>
          Die Übermittlung erfolgt an unser Portal zur internen Bearbeitung unter{" "}
          <span className="font-mono">{portalUrl}</span>. Abhängig von der Konfiguration kann die Anfrage zusätzlich per
          E‑Mail an uns zugestellt werden. Eine Weitergabe erfolgt nur, sofern dies zur Bearbeitung erforderlich ist oder
          eine gesetzliche Verpflichtung besteht.
        </p>
        <p>
          Pflichtangaben sind als solche gekennzeichnet. Ohne diese Angaben können wir die Anfrage ggf. nicht
          beantworten.
        </p>
      </section>

      <section id="cookies" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">5. Cookies / Einwilligungsverwaltung</h2>
        <p>
          Wir setzen Cookies und ähnliche Technologien ein, um die Website bereitzustellen und bestimmte Funktionen zu
          ermöglichen. Technisch notwendige Cookies können durch den Hosting-Provider oder das Framework (Next.js) im
          Rahmen der Auslieferung entstehen.
        </p>
        <p>
          Optionale Funktionen (z.B. Bot-Schutz über Google reCAPTCHA) laden wir nur, wenn du im Cookie-Banner eine
          entsprechende Einwilligung erteilst. Du kannst eine erteilte Einwilligung jederzeit über die Cookie‑Einstellungen
          widerrufen oder ändern.
        </p>
      </section>

      <section id="recaptcha" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">6. Bot-Schutz mit Google reCAPTCHA</h2>
        <p>
          Zum Schutz vor Missbrauch (Spam/automatisierte Anfragen) nutzen wir Google reCAPTCHA. reCAPTCHA wird erst
          geladen, wenn du die entsprechende Einwilligung im Cookie‑Banner erteilt hast (Kategorie „funktional“).
        </p>
        <p>
          Anbieter ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Dabei können u.a.
          Verbindungsdaten (z.B. IP-Adresse), Browser-/Geräteinformationen, Referrer-URL sowie Interaktionsdaten
          verarbeitet werden. Es kann außerdem zum Setzen bzw. Auslesen von Cookies kommen.
        </p>
        <p>
          Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO; § 25 Abs. 1 TTDSG). Wenn du diese
          Einwilligung nicht erteilst, ist die Nutzung des Kontaktformulars ggf. eingeschränkt.
        </p>
      </section>

      <section id="empfaenger" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">7. Empfänger / Auftragsverarbeitung</h2>
        <p>
          Für Hosting und Betrieb der Website sowie für die Bearbeitung von Kontaktanfragen können Dienstleister als
          Auftragsverarbeiter eingesetzt werden. In diesen Fällen bestehen Verträge zur Auftragsverarbeitung (Art. 28
          DSGVO).
        </p>
	        <ul className="list-disc pl-5">
	          <li>
	            Hosting/Serverbetrieb: netcup GmbH, Emmy‑Noether‑Straße 10, 76131 Karlsruhe, Deutschland. Website:{" "}
	            <span className="font-mono">{siteUrl}</span> (Serverstandort i.d.R. Nürnberg, Deutschland).
	          </li>
	          <li>
	            Portal zur Bearbeitung von Anfragen: <span className="font-mono">{portalUrl}</span>
	          </li>
	          <li>Google Ireland Limited (reCAPTCHA), sofern aktiviert.</li>
	        </ul>
	        <p>
	          Soweit erforderlich, wurde mit dem Hosting-Anbieter ein Vertrag zur Auftragsverarbeitung (Art. 28 DSGVO)
	          geschlossen.
	        </p>
	      </section>

      <section id="drittland" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">8. Datenübermittlung in Drittländer</h2>
        <p>
          Sofern wir Dienste einsetzen, deren Anbieter Daten in Drittländern (außerhalb EU/EWR) verarbeiten oder dorthin
          übermitteln, informieren wir darüber in den jeweiligen Abschnitten. Bei Google (reCAPTCHA) kann eine
          Datenübermittlung in die USA nicht ausgeschlossen werden.
        </p>
        <p>
          Soweit erforderlich, erfolgen Übermittlungen auf Basis geeigneter Garantien (z.B. Standardvertragsklauseln der
          EU‑Kommission) oder – sofern anwendbar – auf Grundlage eines Angemessenheitsbeschlusses.
        </p>
      </section>

      <section id="speicher" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">9. Speicherdauer</h2>
        <p>
          Wir speichern personenbezogene Daten nur so lange, wie dies für die genannten Zwecke erforderlich ist oder wir
          gesetzlich dazu verpflichtet sind. Kontaktanfragen werden in der Regel solange gespeichert, wie dies zur
          Bearbeitung und Dokumentation erforderlich ist.
        </p>
        <p>
          Server-Logfiles werden gemäß den Einstellungen des Hosting-Providers nur für eine begrenzte Zeit vorgehalten.
        </p>
      </section>

      <section id="rechte" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">10. Deine Rechte</h2>
        <ul className="list-disc pl-5">
          <li>Auskunft (Art. 15 DSGVO)</li>
          <li>Berichtigung (Art. 16 DSGVO)</li>
          <li>Löschung (Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruch gegen Verarbeitungen auf Basis berechtigter Interessen (Art. 21 DSGVO)</li>
        </ul>
        <p>
          Wenn du uns eine Einwilligung erteilt hast, kannst du diese jederzeit mit Wirkung für die Zukunft widerrufen.
          Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt unberührt.
        </p>
        <p>
          Zudem besteht ein Beschwerderecht bei einer Aufsichtsbehörde. Zuständig ist in der Regel die
          Datenschutzaufsichtsbehörde deines Wohnorts oder des Bundeslands unseres Unternehmenssitzes.
        </p>
      </section>

      <section id="stand" className="grid gap-2 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">11. Stand</h2>
        <p>Stand: {lastUpdated}</p>
      </section>
    </LegalPage>
  );
}
