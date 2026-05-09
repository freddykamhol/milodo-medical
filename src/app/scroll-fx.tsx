"use client";

import { useEffect } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function ScrollFx() {
  useEffect(() => {
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let rafId = 0;
    let ticking = false;

    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const parallaxElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]"),
    );
    const zoomElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-zoom]"),
    );

    const activeZoomElements = new Set<HTMLElement>();

    const updateProgress = () => {
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || 0;
      const maxScroll =
        (document.documentElement.scrollHeight || 1) - window.innerHeight;
      const progress = maxScroll <= 0 ? 0 : clamp(scrollTop / maxScroll, 0, 1);
      root.style.setProperty("--scroll-progress", String(progress));
    };

    const updateParallax = () => {
      if (prefersReducedMotion) return;
      for (const element of parallaxElements) {
        const rect = element.getBoundingClientRect();
        const speedAttr = element.getAttribute("data-parallax-speed");
        const speed = speedAttr ? Number(speedAttr) : 0.14;
        const center = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const distance = center - viewportCenter;
        const y = clamp(-distance * speed, -42, 42);
        element.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
      }
    };

    const updateZoom = () => {
      if (prefersReducedMotion) return;
      const viewportCenter = window.innerHeight / 2;
      const viewportRange = Math.max(240, window.innerHeight * 0.85);

      for (const element of activeZoomElements) {
        const rect = element.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - viewportCenter);
        const proximity = 1 - clamp(distance / viewportRange, 0, 1);

        const fromAttr = element.getAttribute("data-zoom-from");
        const toAttr = element.getAttribute("data-zoom-to");
        const from = fromAttr ? Number(fromAttr) : 1.12;
        const to = toAttr ? Number(toAttr) : 1.0;
        const scale = from + (to - from) * proximity;
        element.style.setProperty("--zoom-scale", scale.toFixed(4));
      }
    };

    updateProgress();
    updateParallax();
    updateZoom();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) el.classList.add("is-visible");
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    const zoomObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) activeZoomElements.add(el);
          else activeZoomElements.delete(el);
        }
      },
      { threshold: 0.05, rootMargin: "20% 0px 20% 0px" },
    );

    for (const el of revealElements) {
      if (prefersReducedMotion) {
        el.classList.add("is-visible");
      } else {
        observer.observe(el);
      }
    }

    for (const el of zoomElements) {
      if (prefersReducedMotion) {
        el.style.setProperty("--zoom-scale", "1");
      } else {
        zoomObserver.observe(el);
      }
    }

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = window.requestAnimationFrame(() => {
        ticking = false;
        updateProgress();
        updateParallax();
        updateZoom();
      });
    };

    const onResize = () => {
      updateProgress();
      updateParallax();
      updateZoom();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
      zoomObserver.disconnect();
    };
  }, []);

  return null;
}
