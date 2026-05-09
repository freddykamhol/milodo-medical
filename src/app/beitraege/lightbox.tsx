"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export type LightboxState = {
  src: string;
  title?: string;
  caption?: string;
  href?: string;
  gallery?: string[];
  index?: number;
} | null;

export default function Lightbox(props: {
  state: LightboxState;
  onClose: () => void;
}) {
  const isOpen = Boolean(props.state);
  const [isPlaying, setIsPlaying] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);

  const gallery = useMemo(() => {
    if (!props.state) return [];
    const list = props.state.gallery && props.state.gallery.length ? props.state.gallery : [props.state.src];
    // de-dupe while preserving order
    const seen = new Set<string>();
    const out: string[] = [];
    for (const item of list) {
      if (!item || seen.has(item)) continue;
      seen.add(item);
      out.push(item);
    }
    return out.length ? out : [props.state.src];
  }, [props.state]);

  const initialIndex = useMemo(() => {
    if (!props.state) return 0;
    if (typeof props.state.index === "number" && Number.isFinite(props.state.index)) {
      return Math.max(0, Math.min(gallery.length - 1, props.state.index));
    }
    const idx = gallery.indexOf(props.state.src);
    return idx >= 0 ? idx : 0;
  }, [gallery, props.state]);

  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const currentSrc = useMemo(() => {
    if (!props.state) return "";
    const idx = Math.min(Math.max(activeIndex, 0), gallery.length - 1);
    return gallery[idx] ?? props.state.src;
  }, [activeIndex, gallery, props.state]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") props.onClose();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
      if (event.key.toLowerCase() === "f") void toggleFullscreen();
      if (event.key === " " || event.key.toLowerCase() === "k") setIsPlaying((p) => !p);
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, props.onClose]);

  useEffect(() => {
    if (!isOpen) return;
    if (!isPlaying) return;
    if (gallery.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % gallery.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, [gallery.length, isOpen, isPlaying]);

  if (!props.state) return null;

  function next() {
    if (gallery.length <= 1) return;
    setActiveIndex((i) => (i + 1) % gallery.length);
  }

  function prev() {
    if (gallery.length <= 1) return;
    setActiveIndex((i) => (i - 1 + gallery.length) % gallery.length);
  }

  async function toggleFullscreen() {
    const el = frameRef.current;
    if (!el) return;
    const doc = document as Document & { fullscreenElement?: Element | null };
    if (doc.fullscreenElement) {
      await document.exitFullscreen?.().catch(() => undefined);
      return;
    }
    await el.requestFullscreen?.().catch(() => undefined);
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-3 opacity-0 transition-opacity duration-200 data-[open=true]:opacity-100 md:p-6"
      data-open={isOpen}
      role="dialog"
      aria-modal="true"
      aria-label={props.state.title ? `Bild: ${props.state.title}` : "Bild"}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) props.onClose();
      }}
    >
      <div
        ref={frameRef}
        className="w-full max-w-6xl translate-y-2 scale-[0.985] overflow-hidden rounded-3xl border border-white/10 bg-black/10 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur transition duration-200 data-[open=true]:translate-y-0 data-[open=true]:scale-100"
        data-open={isOpen}
      >
        <div className="relative bg-black/35">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentSrc}
            alt={props.state.title ?? ""}
            className="h-[78vh] w-full select-none object-contain"
            loading="eager"
            draggable={false}
          />

          {gallery.length > 1 ? (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-black/35 px-3 py-2 text-sm font-semibold text-white/90 backdrop-blur hover:bg-black/45"
                aria-label="Vorheriges Bild"
              >
                ←
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-black/35 px-3 py-2 text-sm font-semibold text-white/90 backdrop-blur hover:bg-black/45"
                aria-label="Nächstes Bild"
              >
                →
              </button>
            </>
          ) : null}

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
            <div className="min-w-0">
              {props.state.title ? (
                <div className="truncate rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur">
                  {props.state.title}
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              {gallery.length > 1 ? (
                <div className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur">
                  {activeIndex + 1}/{gallery.length}
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur hover:bg-black/45"
                aria-label={isPlaying ? "Autoplay stoppen" : "Autoplay starten"}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                onClick={() => void toggleFullscreen()}
                className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur hover:bg-black/45"
                aria-label="Vollbild"
              >
                Vollbild
              </button>
              <button
                type="button"
                onClick={props.onClose}
                className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur hover:bg-black/45"
                aria-label="Schließen"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3">
            {props.state.href ? (
              <Link
                href={props.state.href}
                className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur hover:bg-black/45"
                onClick={props.onClose}
              >
                Zum Beitrag
              </Link>
            ) : (
              <span />
            )}
            <a
              href={currentSrc}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur hover:bg-black/45"
            >
              Neu Tab
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
