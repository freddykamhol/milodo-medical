import type { Metadata } from "next";

import { getAllBlogPostsMeta } from "@/lib/blog";

import SiteFooter from "@/app/site-footer";
import SiteHeader from "@/app/site-header";
import BeitraegeGallery from "./beitraege-gallery";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Alle Beiträge",
  description: "Neuigkeiten und Einblicke aus dem Milodo Medical Alltag.",
};

export default async function AlleBeitraegePage() {
  const all = await getAllBlogPostsMeta();
  const initial = all.slice(0, 12);
  const categories = Array.from(new Set(all.map((p) => p.category))).sort((a, b) =>
    a.localeCompare(b, "de"),
  );
  const years = Array.from(new Set(all.map((p) => p.date.slice(0, 4))))
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a));
  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "kontakt@milodo-medical.de";

  return (
    <div className="relative min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader variant="page" />
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)] shadow-[var(--shadow)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Blog
          </div>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Alle Beiträge
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
            Neuigkeiten, Einblicke und Updates – übersichtlich als Galerie, mit
            Lazy Loading.
          </p>
        </div>

        <div className="mt-10">
          <BeitraegeGallery initialItems={initial} categories={categories} years={years} />
        </div>
      </main>
      <SiteFooter contactEmail={contactEmail} />
    </div>
  );
}
