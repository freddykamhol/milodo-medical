"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef } from "react";

import type { BlogPostMeta } from "@/lib/blog";
import { formatDateDE } from "@/lib/format";
import { blogImageLoader } from "@/lib/images";

export default function BlogCarousel(props: { items: BlogPostMeta[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const hasItems = props.items.length > 0;
  const cards = useMemo(() => props.items.slice(0, 7), [props.items]);

  function scrollByCards(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("[data-card]");
    const cardWidth = first ? first.offsetWidth : 320;
    el.scrollBy({ left: direction * (cardWidth + 16) * 2, behavior: "smooth" });
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/beitraege"
          className="text-sm font-semibold text-[var(--accent)] hover:opacity-80"
        >
          Alle Beiträge ansehen
        </Link>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[color:var(--muted)] shadow-[var(--shadow)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
            aria-label="Zurück"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[color:var(--muted)] shadow-[var(--shadow)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
            aria-label="Weiter"
          >
            →
          </button>
        </div>
      </div>

      {!hasItems ? (
        <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-sm text-[color:var(--muted)] shadow-[var(--shadow)]">
          Noch keine Beiträge vorhanden.
        </div>
      ) : (
        <div
          ref={scrollerRef}
          className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 py-6 [-webkit-overflow-scrolling:touch] [scroll-padding-left:24px] [scroll-padding-right:24px]"
        >
          {cards.map((post) => (
            <Link
              key={post.slug}
              href={`/beitraege/${post.slug}`}
              data-card
              className="group w-[280px] shrink-0 snap-start rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_10px_22px_rgba(11,18,32,0.16)] transition hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] sm:w-[320px]"
            >
              <div className="relative h-40 w-full overflow-hidden rounded-t-3xl bg-[var(--surface-2)]">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="320px"
                    className="object-cover"
                    loading="lazy"
                    unoptimized
                    loader={blogImageLoader}
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--accent)_35%,transparent)_0%,transparent_60%)]" />
                )}
              </div>
              <div className="p-6">
                <div className="text-xs font-semibold text-[color:var(--muted)]">
                  {formatDateDE(post.date)}
                </div>
                <div className="mt-2 text-sm font-semibold tracking-tight">
                  {post.title}
                </div>
                <div className="mt-2 overflow-hidden text-sm leading-relaxed text-[color:var(--muted)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                  {post.excerpt}
                </div>
                <div className="mt-4 text-sm font-semibold text-[var(--accent)]">
                  Weiterlesen
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
