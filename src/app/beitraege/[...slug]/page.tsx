import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllBlogPostsMeta, getBlogPostBySlug } from "@/lib/blog";
import { markdownToHtml } from "@/lib/markdown";
import { estimateReadingTimeMinutes } from "@/lib/reading";
import PostBody from "../post-body";
import PostHero from "../post-hero";

export const runtime = "nodejs";

export async function generateStaticParams() {
  const posts = await getAllBlogPostsMeta();
  return posts.map((post) => ({ slug: post.slug.split("/").filter(Boolean) }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : String(slug || "");
  const post = await getBlogPostBySlug(slugPath);
  if (!post) return { title: "Beitrag nicht gefunden" };

  const title = post.title;
  const description = post.excerpt || "Neuigkeiten und Einblicke aus dem Milodo Medical Alltag.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: post.coverImage ? "summary_large_image" : "summary",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BeitragPage(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await props.params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : String(slug || "");
  const post = await getBlogPostBySlug(slugPath);
  if (!post) notFound();

  const html = await markdownToHtml(post.content);
  const readingTimeMinutes = estimateReadingTimeMinutes(post.content);

  return (
    <div className="relative min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <PostHero
        title={post.title}
        date={post.date}
        coverImage={post.coverImage}
        excerpt={post.excerpt}
        category={post.category}
        readingTimeMinutes={readingTimeMinutes}
      />
      <main className="mx-auto max-w-3xl px-6 pb-12 pt-10 md:pb-16 md:pt-12">
        <PostBody html={html} postTitle={post.title} />
      </main>
    </div>
  );
}
