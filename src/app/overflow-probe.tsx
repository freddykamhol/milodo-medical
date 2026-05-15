"use client";

import { useEffect, useMemo, useState } from "react";

type Offender = {
  el: Element;
  left: number;
  right: number;
  width: number;
  overflowLeft: number;
  overflowRight: number;
};

function formatEl(el: Element) {
  const id = (el as HTMLElement).id ? `#${(el as HTMLElement).id}` : "";
  const cls = (el as HTMLElement).className
    ? `.${String((el as HTMLElement).className).trim().split(/\s+/).slice(0, 3).join(".")}`
    : "";
  return `${el.tagName.toLowerCase()}${id}${cls}`;
}

export default function OverflowProbe() {
  const enabled = useMemo(
    () => String(process.env.NEXT_PUBLIC_DEBUG_OVERFLOW ?? "") === "1",
    [],
  );
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const scan = () => {
      const vw = window.innerWidth;
      const offenders: Offender[] = [];

      const all = Array.from(document.querySelectorAll("body *"));
      for (const el of all) {
        const rect = (el as HTMLElement).getBoundingClientRect?.();
        if (!rect) continue;
        const overflowLeft = Math.max(0, -rect.left);
        const overflowRight = Math.max(0, rect.right - vw);
        if (overflowLeft > 0.5 || overflowRight > 0.5) {
          offenders.push({
            el,
            left: rect.left,
            right: rect.right,
            width: rect.width,
            overflowLeft,
            overflowRight,
          });
        }
      }

      offenders.sort(
        (a, b) =>
          b.overflowLeft + b.overflowRight - (a.overflowLeft + a.overflowRight),
      );

      for (const offender of offenders.slice(0, 12)) {
        (offender.el as HTMLElement).style.outline =
          "2px solid rgba(255,0,0,0.65)";
        (offender.el as HTMLElement).style.outlineOffset = "2px";
      }

      const worst = offenders[0];
      if (worst) {
        setLabel(
          `${formatEl(worst.el)}  ←${worst.overflowLeft.toFixed(0)}px  →${worst.overflowRight.toFixed(0)}px`,
        );
        // eslint-disable-next-line no-console
        console.table(
          offenders.slice(0, 10).map((o) => ({
            el: formatEl(o.el),
            overflowLeft: Math.round(o.overflowLeft),
            overflowRight: Math.round(o.overflowRight),
            left: Math.round(o.left),
            right: Math.round(o.right),
            width: Math.round(o.width),
          })),
        );
      } else {
        setLabel("Kein Overflow gefunden");
      }
    };

    const raf = window.requestAnimationFrame(scan);
    window.addEventListener("resize", scan, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", scan);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-3 left-3 z-[9999] max-w-[calc(100vw-24px)] rounded-2xl border border-red-500/30 bg-white/85 px-3 py-2 text-xs font-semibold text-red-700 shadow-[0_18px_50px_rgba(11,18,32,0.12)] backdrop-blur">
      Overflow Probe: {label ?? "…"}
    </div>
  );
}

