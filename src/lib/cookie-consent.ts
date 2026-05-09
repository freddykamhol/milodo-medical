export type CookieConsentV1 = {
  version: 1;
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string; // ISO
  expiresAt: string; // ISO
};

export const COOKIE_CONSENT_STORAGE_KEY = "milodo_cookie_consent_v1";

const FOUR_WEEKS_MS = 28 * 24 * 60 * 60 * 1000;

export function isConsentValid(consent: CookieConsentV1 | null): consent is CookieConsentV1 {
  if (!consent) return false;
  if (consent.version !== 1) return false;
  if (consent.necessary !== true) return false;
  const expires = Date.parse(consent.expiresAt);
  if (!Number.isFinite(expires)) return false;
  return expires > Date.now();
}

export function loadCookieConsent(): CookieConsentV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentV1;
    return isConsentValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveCookieConsent(input: Omit<CookieConsentV1, "version" | "necessary" | "updatedAt" | "expiresAt">) {
  if (typeof window === "undefined") return;
  const now = new Date();
  const expires = new Date(Date.now() + FOUR_WEEKS_MS);
  const payload: CookieConsentV1 = {
    version: 1,
    necessary: true,
    functional: Boolean(input.functional),
    analytics: Boolean(input.analytics),
    marketing: Boolean(input.marketing),
    updatedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  };
  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent("milodo:cookie-consent-changed", { detail: payload }));
}

