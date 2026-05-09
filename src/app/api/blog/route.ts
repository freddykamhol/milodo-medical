import { NextResponse } from "next/server";

import { getAllBlogPostsMeta } from "@/lib/blog";

export const runtime = "nodejs";

type SortMode = "newest" | "oldest" | "title_asc" | "title_desc";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = Math.max(0, Number(searchParams.get("offset") ?? "0") || 0);
  const limit = Math.min(24, Math.max(1, Number(searchParams.get("limit") ?? "12") || 12));

  const category = String(searchParams.get("category") ?? "").trim();
  const year = String(searchParams.get("year") ?? "").trim();
  const q = String(searchParams.get("q") ?? "").trim().toLowerCase();
  const sort = (String(searchParams.get("sort") ?? "newest") as SortMode) || "newest";

  const all = await getAllBlogPostsMeta();

  const filtered = all.filter((item) => {
    if (category && item.category !== category) return false;
    if (year) {
      const y = item.date.slice(0, 4);
      if (y !== year) return false;
    }
    if (q) {
      const haystack = `${item.title}\n${item.excerpt}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  if (sort === "oldest") filtered.sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug));
  else if (sort === "title_asc") filtered.sort((a, b) => a.title.localeCompare(b.title, "de") || b.date.localeCompare(a.date));
  else if (sort === "title_desc") filtered.sort((a, b) => b.title.localeCompare(a.title, "de") || b.date.localeCompare(a.date));
  else filtered.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));

  const items = filtered.slice(offset, offset + limit);
  const nextOffset = offset + items.length < filtered.length ? offset + items.length : null;

  return NextResponse.json({ items, nextOffset, total: filtered.length });
}
