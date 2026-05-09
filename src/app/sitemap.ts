import type { MetadataRoute } from "next";

import { getAllBlogPostsMeta } from "@/lib/blog";

function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = baseUrl();
  const now = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/beitraege`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/impressum`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/datenschutz`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/agb`, lastModified: now, changeFrequency: "yearly", priority: 0.1 },
  ];

  const posts = await getAllBlogPostsMeta();
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/beitraege/${post.slug}`,
    lastModified: post.date || now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}

