import { legalEntityFromEnv } from "@/lib/legal";
import LegalPage from "@/app/components/legal-page";

export default function DatenschutzPage() {
  const legal = legalEntityFromEnv();
  const lastUpdated = String(process.env.NEXT_PUBLIC_PRIVACY_LAST_UPDATED ?? "").trim() || "—";

  return (
    <LegalPage
      title="Datenschutzerklärung"
      lead="Diese Datenschutzerklärung informiert über die Verarbeitung personenbezogener Daten beim Besuch dieser Website. Bitte ergänze fehlende Angaben (mit „—“ gekennzeichnet) vor dem Launch."
      toc={[
        { href: "#verantwortlicher", label: "Verantwortlicher" },
        { href: "#zwecke", label: "Zwecke & Rechtsgrundlagen" },
        { href: "#logs", label: "Server-Logfiles" },
        { href: "#kontakt", label: "Kontakt (mailto)" },
        { href: "#cookies", label: "Cookies/Tracking" },
        { href: "#empfaenger", label: "Empfänger" },
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
        <ul className="list-disc pl-5">
          <li>
            Bereitstellung der Website, IT-Sicherheit und Fehleranalyse (Art. 6 Abs. 1 lit. f DSGVO – berechtigtes
            Interesse).
          </li>
          <li>
            Kontaktaufnahme per E-Mail / Anfrageformular (mailto) zur Bearbeitung von Anfragen (Art. 6 Abs. 1 lit. b
            DSGVO vorvertragliche Maßnahmen bzw. Art. 6 Abs. 1 lit. f DSGVO).
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
        <h2 className="text-base font-semibold text-[var(--foreground)]">4. Kontaktaufnahme (mailto)</h2>
        <p>
          Diese Website stellt ein Anfrageformular bereit, das beim Klick auf „Anfrage senden“ einen{" "}
          <span className="font-mono">mailto:</span>-Link öffnet. Die eingegebenen Daten werden dabei nicht an einen
          Server dieser Website übertragen, sondern in deinem E-Mail-Programm übernommen und über deinen E-Mail-Anbieter
          versendet.
        </p>
        <p>
          Wir verarbeiten die von dir übermittelten Angaben ausschließlich zur Bearbeitung deiner Anfrage und für
          Anschlussfragen. Eine Weitergabe erfolgt nur, sofern dies zur Bearbeitung erforderlich ist oder eine
          gesetzliche Verpflichtung besteht.
        </p>
      </section>

      <section id="cookies" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">5. Cookies / Tracking</h2>
        <p>
          Derzeit setzen wir keine Tracking- oder Marketing-Cookies ein. Technisch notwendige Cookies können durch den
          Hosting-Provider oder das Framework (Next.js) im Rahmen der Auslieferung entstehen.
        </p>
        <p>
          Falls künftig Analyse- oder Marketingdienste eingebunden werden, erfolgt dies nur nach Einholung einer
          Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) und mit entsprechender Anpassung dieser Datenschutzerklärung.
        </p>
      </section>

      <section id="empfaenger" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">6. Empfänger / Auftragsverarbeitung</h2>
        <p>
          Für Hosting und Betrieb der Website können Dienstleister als Auftragsverarbeiter eingesetzt werden. In diesen
          Fällen bestehen Verträge zur Auftragsverarbeitung (Art. 28 DSGVO).
        </p>
      </section>

      <section id="rechte" className="grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">7. Deine Rechte</h2>
        <ul className="list-disc pl-5">
          <li>Auskunft (Art. 15 DSGVO)</li>
          <li>Berichtigung (Art. 16 DSGVO)</li>
          <li>Löschung (Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruch gegen Verarbeitungen auf Basis berechtigter Interessen (Art. 21 DSGVO)</li>
        </ul>
        <p>
          Zudem besteht ein Beschwerderecht bei einer Aufsichtsbehörde. Zuständig ist in der Regel die
          Datenschutzaufsichtsbehörde deines Wohnorts oder des Bundeslands unseres Unternehmenssitzes.
        </p>
      </section>

      <section id="stand" className="grid gap-2 text-sm leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">8. Stand</h2>
        <p>Stand: {lastUpdated}</p>
      </section>
    </LegalPage>
  );
}
