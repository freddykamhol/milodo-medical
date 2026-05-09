"use client";

import * as React from "react";

export default function OpenCookieSettingsButton(props: { className?: string; label?: string }) {
  return (
    <button
      type="button"
      className={
        props.className ??
        "inline-flex h-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold hover:bg-[var(--surface-2)]"
      }
      onClick={() => {
        if (typeof window === "undefined") return;
        window.__openCookieSettings?.();
        window.dispatchEvent(new Event("milodo:open-cookie-settings"));
      }}
    >
      {props.label ?? "Cookie‑Einstellungen öffnen"}
    </button>
  );
}

