"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { BlogPostMeta } from "@/lib/blog";
import { formatDateDE } from "@/lib/format";
import { blogImageLoader } from "@/lib/images";
import Masonry from "@/app/components/masonry";
// No lightbox on "Alle Beiträge": image click opens the post.

type ApiResponse = {
  items: BlogPostMeta[];
  nextOffset: number | null;
  total: number;
};

type SortMode = "newest" | "oldest" | "title_asc" | "title_desc";

export default function BeitraegeGallery(props: {
  initialItems: BlogPostMeta[];
  categories: string[];
  years: string[];
}) {
  const [items, setItems] = useState<BlogPostMeta[]>(props.initialItems);
  const [nextOffset, setNextOffset] = useState<number | null>(props.initialItems.length);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string>("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState<SortMode>("newest");

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("limit", "12");
    if (q.trim()) sp.set("q", q.trim());
    if (category) sp.set("category", category);
    if (year) sp.set("year", year);
    sp.set("sort", sort);
    return sp.toString();
  }, [category, q, sort, year]);

  const resetAndLoad = useCallback(async () => {
    setLoading(true);
    setError("");
    setDone(false);
    try {
      const res = await fetch(`/api/blog?offset=0&${queryString}`);
      if (!res.ok) throw new Error("Failed to load posts");
      const json = (await res.json()) as ApiResponse;
      setItems(json.items);
      setNextOffset(json.nextOffset);
      if (json.nextOffset == null) setDone(true);
    } catch {
      setError("Beiträge konnten gerade nicht geladen werden. Bitte später erneut versuchen.");
      setItems([]);
      setNextOffset(0);
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void resetAndLoad();
  }, [resetAndLoad]);

  const loadMore = useCallback(async () => {
    if (loading) return;
    if (nextOffset == null) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/blog?offset=${nextOffset}&${queryString}`);
      if (!res.ok) throw new Error("Failed to load posts");
      const json = (await res.json()) as ApiResponse;

      setItems((current) => {
        const slugs = new Set(current.map((item) => item.slug));
        const next = [...current];
        for (const item of json.items) {
          if (slugs.has(item.slug)) continue;
          next.push(item);
        }
        return next;
      });
      setNextOffset(json.nextOffset);
      if (json.nextOffset == null) setDone(true);
    } catch {
      setError("Beiträge konnten gerade nicht geladen werden. Bitte später erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }, [loading, nextOffset, queryString]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    if (done) return;

    const node = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        void loadMore();
      },
      { rootMargin: "800px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [done, loadMore]);

  if (items.length === 0) {
    return (
      <div>
        <FilterBar
          categories={props.categories}
          years={props.years}
          q={q}
          onQ={setQ}
          category={category}
          onCategory={setCategory}
          year={year}
          onYear={setYear}
          sort={sort}
          onSort={setSort}
          loading={loading}
        />

        <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-sm text-[color:var(--muted)] shadow-[var(--shadow)]">
          {error ? error : "Keine Beiträge gefunden. Passe Filter/Suche an oder veröffentliche neue Beiträge."}
        </div>
      </div>
    );
  }

  return (
    <div>
      <FilterBar
        categories={props.categories}
        years={props.years}
        q={q}
        onQ={setQ}
        category={category}
        onCategory={setCategory}
        year={year}
        onYear={setYear}
        sort={sort}
        onSort={setSort}
        loading={loading}
      />

      <div className="mt-6">
        <Masonry minColumns={2} maxColumns={5} gap={16} preferredColumnWidth={320}>
          {items.map((post) => (
            <article
              key={post.slug}
              className="group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]"
            >
              <Link
                href={`/beitraege/${post.slug}`}
                className="relative block aspect-[16/9] w-full bg-[var(--surface-2)] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                aria-label={`Beitrag öffnen: ${post.title}`}
              >
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 will-change-transform group-hover:scale-[1.03] group-hover:[filter:blur(0.6px)] group-active:scale-[1.02] group-active:[filter:blur(0.4px)]"
                    loading="lazy"
                    unoptimized
                    loader={blogImageLoader}
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--accent)_35%,transparent)_0%,transparent_60%)]" />
                )}
              </Link>
              <div className="p-6">
                <div className="text-xs font-semibold text-[color:var(--muted)]">
                  {formatDateDE(post.date)}
                </div>
                <Link
                  href={`/beitraege/${post.slug}`}
                  className="mt-2 block text-sm font-semibold tracking-tight hover:underline hover:underline-offset-4"
                >
                  {post.title}
                </Link>
                <div className="mt-2 overflow-hidden text-sm leading-relaxed text-[color:var(--muted)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                  {post.excerpt}
                </div>
                <Link
                  href={`/beitraege/${post.slug}`}
                  className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)] hover:opacity-80"
                >
                  Weiterlesen
                </Link>
              </div>
            </article>
          ))}
        </Masonry>
      </div>

      <div ref={sentinelRef} className="h-12" />

      <div className="mt-4 text-center text-sm text-[color:var(--muted)]">
        {error
          ? error
          : loading
            ? "Lade weitere Beiträge…"
            : done
              ? "Alle Beiträge geladen."
              : ""}
      </div>
    </div>
  );
}

function FilterBar(props: {
  categories: string[];
  years: string[];
  q: string;
  onQ: (value: string) => void;
  category: string;
  onCategory: (value: string) => void;
  year: string;
  onYear: (value: string) => void;
  sort: SortMode;
  onSort: (value: SortMode) => void;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
        <label className="flex-1">
          <span className="sr-only">Suche</span>
          <input
            value={props.q}
            onChange={(e) => props.onQ(e.target.value)}
            placeholder="Suche nach Titel oder Text…"
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]"
          />
        </label>

        <label>
          <span className="sr-only">Kategorie</span>
          <select
            value={props.category}
            onChange={(e) => props.onCategory(e.target.value)}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] md:w-56"
          >
            <option value="">Alle Kategorien</option>
            {props.categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Jahr</span>
          <select
            value={props.year}
            onChange={(e) => props.onYear(e.target.value)}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] md:w-40"
          >
            <option value="">Alle Jahre</option>
            {props.years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Sortierung</span>
          <select
            value={props.sort}
            onChange={(e) => props.onSort(e.target.value as SortMode)}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] md:w-56"
          >
            <option value="newest">Neueste zuerst</option>
            <option value="oldest">Älteste zuerst</option>
            <option value="title_asc">Titel A–Z</option>
            <option value="title_desc">Titel Z–A</option>
          </select>
        </label>
      </div>

      <div className="text-xs font-semibold text-[color:var(--muted)]">
        {props.loading ? "Aktualisiere…" : " "}
      </div>
    </div>
  );
}
