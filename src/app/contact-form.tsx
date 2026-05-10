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
  website: string; // honeypot
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

function RequiredIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={props.className ?? "h-3.5 w-3.5 text-red-500"}
      fill="currentColor"
    >
      <circle cx="12" cy="12" r="5.5" />
    </svg>
  );
}

export default function ContactForm(props: { toEmail: string; initialMode?: Mode }) {
  const [form, setForm] = useState<FormState>({
    mode: props.initialMode ?? "kontakt",
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
    website: "",
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
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<null | "ok" | "error">(null);

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
  const portalUrl = (process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://app.milodo-medical.de").replace(/\/+$/g, "");
  const recaptchaSiteKey = String(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "").trim();
  const inputClass =
    "h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4";
  const textareaClass =
    "w-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none ring-[var(--accent)]/30 focus:ring-4";

  async function recaptchaToken(action: string): Promise<string> {
    if (!recaptchaSiteKey) return "";
    const grecaptcha = (window as unknown as { grecaptcha?: { ready: (fn: () => void) => void; execute: (key: string, opts: { action: string }) => Promise<string> } })
      .grecaptcha;
    if (!grecaptcha?.ready || !grecaptcha.execute) return "";
    return await new Promise<string>((resolve) => {
      grecaptcha.ready(() => {
        grecaptcha
          .execute(recaptchaSiteKey, { action })
          .then((t) => resolve(String(t ?? "")))
          .catch(() => resolve(""));
      });
    });
  }

  async function submitToPortal() {
    setSubmitting(true);
    setSubmitState(null);
    try {
      const details =
        form.mode === "eh"
          ? {
              targetGroup: sanitize(form.targetGroup),
              trainingDate: sanitize(form.trainingDate),
              trainingLocation: sanitize(form.trainingLocation),
              participantCount: sanitize(form.participantCount),
            }
          : form.mode === "sanitaet"
            ? {
                eventType: sanitize(form.eventType),
                eventDate: sanitize(form.eventDate),
                eventLocation: sanitize(form.eventLocation),
                attendees: sanitize(form.attendees),
                eventDuration: sanitize(form.eventDuration),
              }
            : form.mode === "boerse"
              ? {
                  shiftDateFrom: sanitize(form.shiftDateFrom),
                  shiftDateTo: sanitize(form.shiftDateTo),
                  shiftLocation: sanitize(form.shiftLocation),
                  qualification: sanitize(form.qualification),
                  staffCount: sanitize(form.staffCount),
                }
              : {};

      const recaptchaAction = "contact_inquiry";
      const token = await recaptchaToken(recaptchaAction);

      if (recaptchaSiteKey) {
        const verifyRes = await fetch("/api/recaptcha/verify", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token, action: recaptchaAction }),
        }).catch(() => null);
        const verifyJson = (await verifyRes?.json().catch(() => null)) as { ok?: boolean } | null;
        if (!verifyRes?.ok || !verifyJson?.ok) throw new Error("recaptcha_failed");
      }

      const res = await fetch(`${portalUrl}/api/public/contact-inquiries`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          website: form.website,
          mode: form.mode,
          name: sanitize(form.name),
          company: sanitize(form.company),
          email: sanitize(form.email),
          phone: sanitize(form.phone),
          message: sanitize(form.message),
          details,
          privacyConsent: form.privacyConsent,
          sourceUrl: window.location.href,
          recaptchaToken: token,
          recaptchaAction,
        }),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (!res.ok || !json?.ok) throw new Error("submit_failed");
      setSubmitState("ok");
      setForm((prev) => ({
        ...prev,
        name: "",
        company: "",
        email: "",
        phone: "",
        message: "",
        website: "",
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
      }));
    } catch {
      setSubmitState("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm font-semibold tracking-tight text-[var(--foreground)]">Anfrageformular</div>
          <p className="mt-1 text-sm leading-relaxed text-[color:var(--muted)]">
            Wähle das Anliegen aus und sende uns die wichtigsten Infos. Wir melden uns zeitnah zurück.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs text-[color:var(--muted)]">
          <RequiredIcon className="h-3.5 w-3.5 text-red-500" />
          Pflichtfelder
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-3 md:p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => set("mode", "eh")}
          className={`min-h-[74px] rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
            form.mode === "eh"
              ? "border-[color-mix(in_oklab,var(--accent)_55%,var(--border))] bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-soft)]"
              : "border-[var(--border)] bg-[var(--surface-2)] text-[color:var(--muted)] hover:bg-[var(--surface)]"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span>EH-Ausbildung</span>
            {form.mode === "eh" ? (
              <span className="rounded-full bg-[color:var(--accent)] px-2 py-0.5 text-[10px] font-semibold text-white">
                Auswahl
              </span>
            ) : null}
          </div>
          <div className="mt-1 hidden text-xs font-medium text-[color:var(--muted)] lg:block">
            Betriebliche Kurse & Inhouse
          </div>
        </button>
        <button
          type="button"
          onClick={() => set("mode", "sanitaet")}
          className={`min-h-[74px] rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
            form.mode === "sanitaet"
              ? "border-[color-mix(in_oklab,var(--accent)_55%,var(--border))] bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-soft)]"
              : "border-[var(--border)] bg-[var(--surface-2)] text-[color:var(--muted)] hover:bg-[var(--surface)]"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span>Sanitätsdienst</span>
            {form.mode === "sanitaet" ? (
              <span className="rounded-full bg-[color:var(--accent)] px-2 py-0.5 text-[10px] font-semibold text-white">
                Auswahl
              </span>
            ) : null}
          </div>
          <div className="mt-1 hidden text-xs font-medium text-[color:var(--muted)] lg:block">Events, Firmen & Sport</div>
        </button>
        <button
          type="button"
          onClick={() => set("mode", "boerse")}
          className={`min-h-[74px] rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
            form.mode === "boerse"
              ? "border-[color-mix(in_oklab,var(--accent)_55%,var(--border))] bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-soft)]"
              : "border-[var(--border)] bg-[var(--surface-2)] text-[color:var(--muted)] hover:bg-[var(--surface)]"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span>Personal (Börse)</span>
            {form.mode === "boerse" ? (
              <span className="rounded-full bg-[color:var(--accent)] px-2 py-0.5 text-[10px] font-semibold text-white">
                Auswahl
              </span>
            ) : null}
          </div>
          <div className="mt-1 hidden text-xs font-medium text-[color:var(--muted)] lg:block">
            Schichten & kurzfristige Einsätze
          </div>
        </button>
        <button
          type="button"
          onClick={() => set("mode", "kontakt")}
          className={`min-h-[74px] rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
            form.mode === "kontakt"
              ? "border-[color-mix(in_oklab,var(--accent)_55%,var(--border))] bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-soft)]"
              : "border-[var(--border)] bg-[var(--surface-2)] text-[color:var(--muted)] hover:bg-[var(--surface)]"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span>Kontakt</span>
            {form.mode === "kontakt" ? (
              <span className="rounded-full bg-[color:var(--accent)] px-2 py-0.5 text-[10px] font-semibold text-white">
                Auswahl
              </span>
            ) : null}
          </div>
          <div className="mt-1 hidden text-xs font-medium text-[color:var(--muted)] lg:block">Allgemeine Anfrage</div>
        </button>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold tracking-wide text-[color:var(--muted)]">Kontaktdaten</div>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--muted)]">
            Name <RequiredIcon />
          </span>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputClass}
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
            className={inputClass}
            autoComplete="organization"
            placeholder="Unternehmen / Organisation"
          />
        </label>
        <label className="grid gap-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--muted)]">
            E-Mail <RequiredIcon />
          </span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputClass}
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
            className={inputClass}
            autoComplete="tel"
            inputMode="tel"
            placeholder="+49 …"
          />
        </label>
      </div>

      {form.mode === "eh" ? (
        <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold tracking-wide text-[color:var(--muted)]">Details EH-Ausbildung</div>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 sm:col-span-2">
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              Zielgruppe
            </span>
            <input
              value={form.targetGroup}
              onChange={(e) => set("targetGroup", e.target.value)}
              className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
              placeholder="Adresse / Standort"
            />
          </label>
          </div>
        </div>
      ) : null}

      {form.mode === "sanitaet" ? (
        <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold tracking-wide text-[color:var(--muted)]">Details Sanitätsdienst</div>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              Art der Veranstaltung
            </span>
            <input
              value={form.eventType}
              onChange={(e) => set("eventType", e.target.value)}
              className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
              placeholder="z.B. 14:00–23:00"
            />
          </label>
          </div>
        </div>
      ) : null}

      {form.mode === "boerse" ? (
        <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold tracking-wide text-[color:var(--muted)]">Details Personal (Börse)</div>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              Zeitraum von
            </span>
            <input
              value={form.shiftDateFrom}
              onChange={(e) => set("shiftDateFrom", e.target.value)}
              className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
              placeholder="NRW (optional genaue Adresse)"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              Qualifikation
            </span>
            <input
              value={form.qualification}
              onChange={(e) => set("qualification", e.target.value)}
              className={inputClass}
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
              className={inputClass}
              inputMode="numeric"
              placeholder="z.B. 2"
            />
          </label>
          </div>
        </div>
      ) : null}

      <div className="mt-6">
        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold tracking-wide text-[color:var(--muted)]">Nachricht</div>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>
        <textarea
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          rows={4}
          className={`mt-4 ${textareaClass}`}
          placeholder="Kurz beschreiben, worum es geht …"
        />
      </div>

      <div className="hidden">
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-[color:var(--muted)]">Website</span>
          <input
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
            className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none"
            autoComplete="off"
            tabIndex={-1}
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-2">
          <label className="flex items-start gap-2 rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-xs text-[color:var(--muted)]">
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
            Hinweis: Deine Angaben werden zur Bearbeitung der Anfrage an unser Portal übermittelt und parallel per
            E‑Mail an uns gesendet.
          </div>
          {submitState === "ok" ? (
            <div className="text-xs font-semibold text-[color:var(--muted)]">
              Danke! Deine Anfrage ist eingegangen.
            </div>
          ) : null}
          {submitState === "error" ? (
            <div className="text-xs text-red-600">
              Versand fehlgeschlagen. Bitte versuche es erneut oder nutze{" "}
              <a className="underline underline-offset-4" href={mailto}>
                E‑Mail
              </a>
              .
            </div>
          ) : null}
        </div>
        <button
          type="button"
          disabled={!requiredOk || submitting}
          onClick={submitToPortal}
          className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow)] transition ${
            requiredOk && !submitting ? "bg-[var(--accent)] hover:opacity-90" : "bg-zinc-300 text-white/90"
          }`}
        >
          {submitting ? "Sende…" : "Anfrage senden"}
        </button>
      </div>
    </div>
  );
}
