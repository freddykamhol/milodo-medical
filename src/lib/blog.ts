import fs from "node:fs/promises";
import path from "node:path";

import { getSftpConfigFromEnv, sftpBlogRoot, withSftp } from "@/lib/sftp";

type BlogExportMeta = {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  titleImageKey: string;
  publishedAt: string; // ISO
};

export type BlogPostMeta = {
  id: number;
  slug: string; // `${category}/${slug}` (catch-all route segment)
  title: string;
  category: string;
  date: string; // ISO YYYY-MM-DD
  excerpt: string;
  coverImage?: string; // e.g. `/blog/uploads/...`
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

function exportBaseDir(): string {
  // This matches what `milodo-app` writes on publish:
  // `data/blog/<category>/<postId>/{post.json,content.md}` (+ assets under `data/blog/uploads/...`)
  const fromEnv = process.env.BLOG_EXPORT_DIR;
  if (fromEnv && fromEnv.trim()) return fromEnv.trim();
  return path.join(process.cwd(), "data", "blog");
}

function coverImageFromKey(titleImageKey: string): string | undefined {
  const key = String(titleImageKey || "").trim().replaceAll("\\", "/");
  if (!key) return undefined;
  if (!key.startsWith("blog/")) return undefined;
  return `/api/blog/assets/raw?key=${encodeURIComponent(key)}`;
}

async function readJson(filePath: string): Promise<unknown> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as unknown;
}

async function listCategories(dir: string): Promise<string[]> {
  const sftpCfg = getSftpConfigFromEnv();
  if (sftpCfg) {
    const remote = sftpBlogRoot(sftpCfg);
    const res = await withSftp(async (client) => client.list(remote));
    if (!res) return [];
    const entries = res as Array<{ type: string; name: string }>;
    return entries.filter((e) => e.type === "d").map((e) => e.name);
  }

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function listPostIds(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function listRemotePostIds(category: string): Promise<string[]> {
  const sftpCfg = getSftpConfigFromEnv();
  if (!sftpCfg) return [];
  const remote = path.posix.join(sftpBlogRoot(sftpCfg), category);
  const res = await withSftp(async (client) => client.list(remote));
  if (!res) return [];
  const entries = res as Array<{ type: string; name: string }>;
  return entries.filter((e) => e.type === "d").map((e) => e.name);
}

function toMeta(m: BlogExportMeta): BlogPostMeta {
  const date = String(m.publishedAt || "").slice(0, 10) || "1970-01-01";
  const slugPath = `${m.category}/${m.slug}`.replaceAll(/^\/+|\/+$/g, "");
  return {
    id: Number(m.id) || 0,
    slug: slugPath,
    title: String(m.title || "").trim() || m.slug,
    category: String(m.category || "").trim() || "allgemein",
    date,
    excerpt: String(m.excerpt || "").trim(),
    coverImage: coverImageFromKey(m.titleImageKey),
  };
}

export async function getAllBlogPostsMeta(): Promise<BlogPostMeta[]> {
  const base = exportBaseDir();
  const categories = await listCategories(base);
  const sftpCfg = getSftpConfigFromEnv();

  const metas: BlogPostMeta[] = [];
  for (const category of categories) {
    // ignore uploads folder
    if (category === "uploads") continue;

    const catDir = path.join(base, category);
    const ids = sftpCfg ? await listRemotePostIds(category) : await listPostIds(catDir);
    for (const id of ids) {
      const postJsonPath = path.join(catDir, id, "post.json");
      try {
        const meta = sftpCfg
          ? ((await withSftp(async (client, cfg) => {
              const remotePath = path.posix.join(sftpBlogRoot(cfg), category, id, "post.json");
              const raw = await client.get(remotePath);
              const text = Buffer.isBuffer(raw)
                ? raw.toString("utf8")
                : raw instanceof Uint8Array
                  ? Buffer.from(raw).toString("utf8")
                  : String(raw);
              return JSON.parse(text) as unknown;
            })) as BlogExportMeta | null)
          : ((await readJson(postJsonPath)) as BlogExportMeta);

        if (!meta) continue;
        if (!meta || typeof meta !== "object") continue;
        if (String(meta.category || "") !== category) continue;
        metas.push(toMeta(meta));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
        // ignore invalid JSON files
        continue;
      }
    }
  }

  metas.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  return metas;
}

export async function getLatestBlogPostsMeta(limit = 7): Promise<BlogPostMeta[]> {
  const all = await getAllBlogPostsMeta();
  return all.slice(0, limit);
}

function splitSlugPath(slugPath: string): { category: string; slug: string } | null {
  const parts = slugPath.split("/").filter(Boolean);
  if (parts.length !== 2) return null;
  return { category: parts[0]!, slug: parts[1]! };
}

export async function getBlogPostBySlug(slugPath: string): Promise<BlogPost | null> {
  const parsed = splitSlugPath(slugPath);
  if (!parsed) return null;

  const base = exportBaseDir();
  const sftpCfg = getSftpConfigFromEnv();
  const catDir = path.join(base, parsed.category);
  const ids = sftpCfg ? await listRemotePostIds(parsed.category) : await listPostIds(catDir);

  for (const id of ids) {
    const dir = path.join(catDir, id);
    const postJsonPath = path.join(dir, "post.json");
    const contentPath = path.join(dir, "content.md");

    try {
      const meta = sftpCfg
        ? ((await withSftp(async (client, cfg) => {
            const remotePath = path.posix.join(sftpBlogRoot(cfg), parsed.category, id, "post.json");
            const raw = await client.get(remotePath);
            const text = Buffer.isBuffer(raw)
              ? raw.toString("utf8")
              : raw instanceof Uint8Array
                ? Buffer.from(raw).toString("utf8")
                : String(raw);
            return JSON.parse(text) as unknown;
          })) as BlogExportMeta | null)
        : ((await readJson(postJsonPath)) as BlogExportMeta);
      if (!meta) continue;
      if (String(meta.slug || "") !== parsed.slug) continue;
      const content = sftpCfg
        ? ((await withSftp(async (client, cfg) => {
            const remotePath = path.posix.join(sftpBlogRoot(cfg), parsed.category, id, "content.md");
            const raw = await client.get(remotePath);
            if (Buffer.isBuffer(raw)) return raw.toString("utf8");
            if (raw instanceof Uint8Array) return Buffer.from(raw).toString("utf8");
            return String(raw);
          })) ?? "")
        : await fs.readFile(contentPath, "utf8").catch(() => "");
      return { ...toMeta(meta), content };
    } catch {
      continue;
    }
  }

  return null;
}
