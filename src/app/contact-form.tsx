"use client";

import { useMemo, useState } from "react";

type Mode = "eh" | "sanitaet" | "boerse" | "kontakt";

type FormState = {
  mode: Mode;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  privacyConsent: boolean;

  // EH-Ausbildung
  trainingDate: string;
  trainingLocation: string;
  participantCount: string;
  targetGroup: string;

  // Sanitätsdienst
  eventType: string;
  eventDate: string;
  eventLocation: string;
  attendees: string;
  eventDuration: string;

  // Personalbörse
  shiftDateFrom: string;
  shiftDateTo: string;
  shiftLocation: string;
  qualification: string;
  staffCount: string;
};

function sanitize(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function buildMailto(toEmail: string, subject: string, body: string) {
  const query = new URLSearchParams({
    subject,
    body,
  }).toString();
  return `mailto:${encodeURIComponent(toEmail)}?${query}`;
}

export default function ContactForm(props: { toEmail: string; initialMode?: Mode }) {
  const [form, setForm] = useState<FormState>({
    mode: props.initialMode ?? "kontakt",
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
    privacyConsent: false,

    trainingDate: "",
    trainingLocation: "",
    participantCount: "",
    targetGroup: "",

    eventType: "",
    eventDate: "",
    eventLocation: "",
    attendees: "",
    eventDuration: "",

    shiftDateFrom: "",
    shiftDateTo: "",
    shiftLocation: "",
    qualification: "",
    staffCount: "",
  });

  const subject = useMemo(() => {
    if (form.mode === "eh") return "Anforderung EH-Ausbildung";
    if (form.mode === "sanitaet") return "Anforderung Sanitätsdienst";
    if (form.mode === "boerse") return "Anforderung Personal (Börse)";
    return "Kontaktanfrage";
  }, [form.mode]);

  const body = useMemo(() => {
    const lines: string[] = [];
    lines.push(`Anfrage-Typ: ${subject}`);
    lines.push("");
    lines.push("Kontaktdaten");
    lines.push(`Name: ${sanitize(form.name) || "-"}`);
    lines.push(`Firma: ${sanitize(form.company) || "-"}`);
    lines.push(`E-Mail: ${sanitize(form.email) || "-"}`);
    lines.push(`Telefon: ${sanitize(form.phone) || "-"}`);
    lines.push("");

    if (form.mode === "eh") {
      lines.push("Details EH-Ausbildung");
      lines.push(`Zielgruppe: ${sanitize(form.targetGroup) || "-"}`);
      lines.push(`Datum/Wunschtermin: ${sanitize(form.trainingDate) || "-"}`);
      lines.push(`Ort: ${sanitize(form.trainingLocation) || "-"}`);
      lines.push(`Teilnehmende: ${sanitize(form.participantCount) || "-"}`);
      lines.push("");
    }

    if (form.mode === "sanitaet") {
      lines.push("Details Sanitätsdienst");
      lines.push(`Art der Veranstaltung: ${sanitize(form.eventType) || "-"}`);
      lines.push(`Datum: ${sanitize(form.eventDate) || "-"}`);
      lines.push(`Ort: ${sanitize(form.eventLocation) || "-"}`);
      lines.push(`Teilnehmerzahl: ${sanitize(form.attendees) || "-"}`);
      lines.push(`Dauer/Zeitraum: ${sanitize(form.eventDuration) || "-"}`);
      lines.push("");
    }

    if (form.mode === "boerse") {
      lines.push("Details Personal (Börse)");
      lines.push(`Zeitraum von: ${sanitize(form.shiftDateFrom) || "-"}`);
      lines.push(`Zeitraum bis: ${sanitize(form.shiftDateTo) || "-"}`);
      lines.push(`Einsatzort: ${sanitize(form.shiftLocation) || "-"}`);
      lines.push(`Qualifikation: ${sanitize(form.qualification) || "-"}`);
      lines.push(`Anzahl Personen: ${sanitize(form.staffCount) || "-"}`);
      lines.push("");
    }

    lines.push("Nachricht");
    lines.push(sanitize(form.message) || "-");

    return lines.join("\n");
  }, [
    form.attendees,
    form.company,
    form.email,
    form.eventDate,
    form.eventDuration,
    form.eventLocation,
    form.eventType,
    form.message,
    form.mode,
    form.name,
    form.phone,
    form.qualification,
    form.shiftDateFrom,
    form.shiftDateTo,
    form.shiftLocation,
    form.staffCount,
    form.participantCount,
    form.targetGroup,
    form.trainingDate,
    form.trainingLocation,
    subject,
  ]);

  const mailto = useMemo(
    () => buildMailto(props.toEmail, subject, body),
    [props.toEmail, subject, body],
  );

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const requiredOk = Boolean(sanitize(form.name) && sanitize(form.email) && form.privacyConsent);

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] md:p-8">
      <div className="text-sm font-semibold tracking-tight text-[var(--foreground)]">
        Anfrageformular
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
        Wähle das Anliegen aus und sende uns die wichtigsten Infos. Wir melden
        uns zeitnah zurück.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => set("mode", "eh")}
          className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
            form.mode === "eh"
              ? "border-[color-mix(in_oklab,var(--accent)_55%,var(--border))] bg-[var(--surface-2)] text-[var(--foreground)]"
              : "border-[var(--border)] bg-[var(--surface)] text-[color:var(--muted)] hover:bg-[var(--surface-2)]"
          }`}
        >
          EH-Ausbildung
        </button>
        <button
          type="button"
          onClick={() => set("mode", "sanitaet")}
          className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
            form.mode === "sanitaet"
              ? "border-[color-mix(in_oklab,var(--accent)_55%,var(--border))] bg-[var(--surface-2)] text-[var(--foreground)]"
              : "border-[var(--border)] bg-[var(--surface)] text-[color:var(--muted)] hover:bg-[var(--surface-2)]"
          }`}
        >
          Sanitätsdienst
        </button>
        <button
          type="button"
          onClick={() => set("mode", "boerse")}
          className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
            form.mode === "boerse"
              ? "border-[color-mix(in_oklab,var(--accent)_55%,var(--border))] bg-[var(--surface-2)] text-[var(--foreground)]"
              : "border-[var(--border)] bg-[var(--surface)] text-[color:var(--muted)] hover:bg-[var(--surface-2)]"
          }`}
        >
          Personal (Börse)
        </button>
        <button
          type="button"
          onClick={() => set("mode", "kontakt")}
          className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
            form.mode === "kontakt"
              ? "border-[color-mix(in_oklab,var(--accent)_55%,var(--border))] bg-[var(--surface-2)] text-[var(--foreground)]"
              : "border-[var(--border)] bg-[var(--surface)] text-[color:var(--muted)] hover:bg-[var(--surface-2)]"
          }`}
        >
          Kontakt
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-[color:var(--muted)]">
            Name *
          </span>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
            autoComplete="name"
            placeholder="Vor- und Nachname"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-[color:var(--muted)]">
            Firma
          </span>
          <input
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
            className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
            autoComplete="organization"
            placeholder="Unternehmen / Organisation"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-[color:var(--muted)]">
            E-Mail *
          </span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
            autoComplete="email"
            inputMode="email"
            placeholder="name@firma.de"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-[color:var(--muted)]">
            Telefon
          </span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+49 …"
          />
        </label>
      </div>

      {form.mode === "eh" ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 sm:col-span-2">
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              Zielgruppe
            </span>
            <input
              value={form.targetGroup}
              onChange={(e) => set("targetGroup", e.target.value)}
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
              placeholder="z.B. Betrieb, Praxis-Team, Pflege-Team"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              Wunschtermin
            </span>
            <input
              value={form.trainingDate}
              onChange={(e) => set("trainingDate", e.target.value)}
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
              placeholder="TT.MM.JJJJ"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              Teilnehmende
            </span>
            <input
              value={form.participantCount}
              onChange={(e) => set("participantCount", e.target.value)}
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
              inputMode="numeric"
              placeholder="z.B. 12"
            />
          </label>
          <label className="grid gap-1 sm:col-span-2">
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              Ort
            </span>
            <input
              value={form.trainingLocation}
              onChange={(e) => set("trainingLocation", e.target.value)}
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
              placeholder="Adresse / Standort"
            />
          </label>
        </div>
      ) : null}

      {form.mode === "sanitaet" ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              Art der Veranstaltung
            </span>
            <input
              value={form.eventType}
              onChange={(e) => set("eventType", e.target.value)}
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
              placeholder="z.B. Konzert, Sport, Firmenfeier"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              Datum
            </span>
            <input
              value={form.eventDate}
              onChange={(e) => set("eventDate", e.target.value)}
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
              placeholder="TT.MM.JJJJ"
            />
          </label>
          <label className="grid gap-1 sm:col-span-2">
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              Ort
            </span>
            <input
              value={form.eventLocation}
              onChange={(e) => set("eventLocation", e.target.value)}
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
              placeholder="Adresse / Location"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              Teilnehmerzahl
            </span>
            <input
              value={form.attendees}
              onChange={(e) => set("attendees", e.target.value)}
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
              inputMode="numeric"
              placeholder="z.B. 500"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              Dauer / Zeitraum
            </span>
            <input
              value={form.eventDuration}
              onChange={(e) => set("eventDuration", e.target.value)}
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
              placeholder="z.B. 14:00–23:00"
            />
          </label>
        </div>
      ) : null}

      {form.mode === "boerse" ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              Zeitraum von
            </span>
            <input
              value={form.shiftDateFrom}
              onChange={(e) => set("shiftDateFrom", e.target.value)}
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
              placeholder="TT.MM.JJJJ"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              Zeitraum bis
            </span>
            <input
              value={form.shiftDateTo}
              onChange={(e) => set("shiftDateTo", e.target.value)}
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
              placeholder="TT.MM.JJJJ"
            />
          </label>
          <label className="grid gap-1 sm:col-span-2">
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              Einsatzort
            </span>
            <input
              value={form.shiftLocation}
              onChange={(e) => set("shiftLocation", e.target.value)}
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
              placeholder="Dortmund (optional genaue Adresse)"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              Qualifikation
            </span>
            <input
              value={form.qualification}
              onChange={(e) => set("qualification", e.target.value)}
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
              placeholder="z.B. RS/RA/NFS"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              Anzahl Personen
            </span>
            <input
              value={form.staffCount}
              onChange={(e) => set("staffCount", e.target.value)}
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
              inputMode="numeric"
              placeholder="z.B. 2"
            />
          </label>
        </div>
      ) : null}

      <div className="mt-6 grid gap-1">
        <span className="text-xs font-semibold text-[color:var(--muted)]">
          Nachricht
        </span>
        <textarea
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          rows={4}
          className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4"
          placeholder="Kurz beschreiben, worum es geht …"
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-2">
          <div className="text-xs text-[color:var(--muted)]">* Pflichtfelder</div>
          <label className="flex items-start gap-2 text-xs text-[color:var(--muted)]">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border border-[var(--border)] accent-[var(--accent)]"
              checked={form.privacyConsent}
              onChange={(e) => set("privacyConsent", e.target.checked)}
            />
            <span>
              Ich habe die{" "}
              <a className="underline underline-offset-4 hover:text-[var(--foreground)]" href="/datenschutz">
                Datenschutzerklärung
              </a>{" "}
              gelesen und bin mit der Verarbeitung meiner Angaben zur Bearbeitung der Anfrage einverstanden.
            </span>
          </label>
          <div className="text-[11px] leading-relaxed text-[color:var(--muted)]">
            Hinweis: Beim Klick auf „Anfrage senden“ öffnet sich dein E-Mail-Programm (mailto). Die Übermittlung erfolgt
            über deinen E-Mail-Anbieter.
          </div>
        </div>
        <a
          className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow)] transition ${
            requiredOk
              ? "bg-[var(--accent)] hover:opacity-90"
              : "bg-zinc-300 text-white/90 pointer-events-none"
          }`}
          href={mailto}
        >
          Anfrage senden
        </a>
      </div>
    </div>
  );
}
