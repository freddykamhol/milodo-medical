"use client";

import * as React from "react";

import { loadCookieConsent, saveCookieConsent, type CookieConsentV1 } from "@/lib/cookie-consent";

declare global {
  interface Window {
    __openCookieSettings?: () => void;
  }
}

function ToggleRow(props: {
  title: string;
  description: string;
  value: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
      <div className="grid gap-1">
        <div className="text-sm font-semibold tracking-tight">{props.title}</div>
        <div className="text-xs leading-relaxed text-[color:var(--muted)]">{props.description}</div>
      </div>
      <button
        type="button"
        disabled={props.disabled || !props.onChange}
        onClick={() => props.onChange?.(!props.value)}
        className={`relative inline-flex h-7 w-12 flex-none items-center rounded-full border transition ${
          props.value
            ? "border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] bg-[color-mix(in_oklab,var(--accent)_20%,white)]"
            : "border-[var(--border)] bg-white/70"
        } ${props.disabled ? "opacity-60" : "hover:opacity-90"}`}
        aria-pressed={props.value}
        aria-label={props.title}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
            props.value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function CookieConsent() {
  const [consent, setConsent] = React.useState<CookieConsentV1 | null>(null);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const [draft, setDraft] = React.useState({
    functional: false,
    analytics: false,
    marketing: false,
  });

  React.useEffect(() => {
    setMounted(true);
    const existing = loadCookieConsent();
    setConsent(existing);
    if (existing) {
      setDraft({
        functional: existing.functional,
        analytics: existing.analytics,
        marketing: existing.marketing,
      });
    }
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    function onChanged(e: Event) {
      const detail = (e as CustomEvent<CookieConsentV1>).detail;
      setConsent(detail);
      setDraft({
        functional: detail.functional,
        analytics: detail.analytics,
        marketing: detail.marketing,
      });
    }

    window.addEventListener("milodo:cookie-consent-changed", onChanged as EventListener);
    return () => window.removeEventListener("milodo:cookie-consent-changed", onChanged as EventListener);
  }, [mounted]);

  React.useEffect(() => {
    if (!mounted) return;
    window.__openCookieSettings = () => setSettingsOpen(true);
    const onOpen = () => setSettingsOpen(true);
    window.addEventListener("milodo:open-cookie-settings", onOpen);
    return () => {
      window.removeEventListener("milodo:open-cookie-settings", onOpen);
      if (window.__openCookieSettings) delete window.__openCookieSettings;
    };
  }, [mounted]);

  React.useEffect(() => {
    if (!mounted) return;
    if (!settingsOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted, settingsOpen]);

  const showBanner = mounted && !consent;

  function acceptAll() {
    saveCookieConsent({ functional: true, analytics: true, marketing: true });
  }

  function rejectAll() {
    saveCookieConsent({ functional: false, analytics: false, marketing: false });
  }

  function saveSettings() {
    saveCookieConsent(draft);
    setSettingsOpen(false);
  }

  return (
    <>
      {showBanner ? (
        <div className="fixed inset-x-0 bottom-0 z-[2000] p-4 md:p-6">
          <div className="mx-auto max-w-4xl rounded-3xl border border-[var(--border)] bg-[var(--surface)]/85 p-5 shadow-[var(--shadow)] backdrop-blur-2xl">
            <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start md:gap-6">
              <div className="grid gap-2">
                <div className="text-sm font-semibold tracking-tight">Cookies & Einwilligung</div>
                <div className="text-sm leading-relaxed text-[color:var(--muted)]">
                  Wir verwenden technisch notwendige Cookies. Optionale Cookies (z.B. Funktionalität) kannst du in den
                  Einstellungen steuern. Die Auswahl wird für 4 Wochen gespeichert.
                </div>
                <div className="text-xs text-[color:var(--muted)]">
                  Details in unserer{" "}
                  <a className="underline underline-offset-4 hover:text-[var(--foreground)]" href="/cookies">
                    Cookie‑Info
                  </a>
                  .
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={rejectAll}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold hover:bg-[var(--surface-2)]"
                >
                  Ablehnen
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold hover:bg-[var(--surface-2)]"
                >
                  Einstellungen
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-4 text-sm font-semibold text-white shadow-[var(--shadow-soft)] hover:opacity-90"
                >
                  Akzeptieren
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {mounted && settingsOpen ? (
        <div
          className="fixed inset-0 z-[2100] flex items-center justify-center bg-white/10 backdrop-blur-3xl backdrop-saturate-150 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Cookie-Einstellungen"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSettingsOpen(false);
          }}
        >
          <div className="w-full max-w-2xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold tracking-tight">Cookie‑Einstellungen</div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">
                  Auswahl wird für 4 Wochen gespeichert. Tracking/Marketing ist standardmäßig deaktiviert.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold hover:bg-[var(--surface-2)]"
              >
                Schließen
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              <ToggleRow
                title="Notwendig"
                description="Für den Betrieb der Website (immer aktiv)."
                value
                disabled
              />
              <ToggleRow
                title="Funktional"
                description="Z.B. Spam-Schutz (reCAPTCHA) für Formulare."
                value={draft.functional}
                onChange={(next) => setDraft((p) => ({ ...p, functional: next }))}
              />
              <ToggleRow
                title="Analyse"
                description="Zur Verbesserung der Website. Aktuell nicht genutzt."
                value={draft.analytics}
                onChange={(next) => setDraft((p) => ({ ...p, analytics: next }))}
              />
              <ToggleRow
                title="Marketing"
                description="Für personalisierte Werbung. Aktuell nicht genutzt."
                value={draft.marketing}
                onChange={(next) => setDraft((p) => ({ ...p, marketing: next }))}
              />
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={rejectAll}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold hover:bg-[var(--surface-2)]"
              >
                Alles ablehnen
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold hover:bg-[var(--surface-2)]"
              >
                Alles akzeptieren
              </button>
              <button
                type="button"
                onClick={saveSettings}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-4 text-sm font-semibold text-white shadow-[var(--shadow-soft)] hover:opacity-90"
              >
                Speichern
              </button>
            </div>

            <div className="mt-3 text-xs text-[color:var(--muted)]">
              Mehr Infos:{" "}
              <a className="underline underline-offset-4 hover:text-[var(--foreground)]" href="/cookies">
                Cookie‑Info
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

