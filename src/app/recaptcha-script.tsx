"use client";

import * as React from "react";

import { loadCookieConsent } from "@/lib/cookie-consent";

function ensureScript(src: string) {
  if (typeof document === "undefined") return;
  const existing = document.querySelector(`script[src="${CSS.escape(src)}"]`);
  if (existing) return;
  const s = document.createElement("script");
  s.src = src;
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);
}

export default function RecaptchaScript(props: { siteKey: string }) {
  React.useEffect(() => {
    const siteKey = String(props.siteKey ?? "").trim();
    if (!siteKey) return;

    const load = () => {
      const consent = loadCookieConsent();
      if (!consent?.functional) return;
      const src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
      ensureScript(src);
    };

    load();
    const onChanged = () => load();
    window.addEventListener("milodo:cookie-consent-changed", onChanged);
    return () => window.removeEventListener("milodo:cookie-consent-changed", onChanged);
  }, [props.siteKey]);

  return null;
}

