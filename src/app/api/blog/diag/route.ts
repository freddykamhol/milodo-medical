import path from "node:path";

import { NextResponse } from "next/server";

import { getSftpConfigFromEnv, sftpBlogRoot, withSftp } from "@/lib/sftp";

export const runtime = "nodejs";

function mask(value: string): string {
  const v = String(value ?? "").trim();
  if (!v) return "";
  if (v.length <= 4) return "****";
  return `${v.slice(0, 2)}***${v.slice(-2)}`;
}

function isAllowed(request: Request): boolean {
  const token = String(process.env.BLOG_DIAG_TOKEN ?? "").trim();
  if (!token) return false;
  const url = new URL(request.url);
  const provided = String(url.searchParams.get("token") ?? request.headers.get("x-blog-diag-token") ?? "").trim();
  return provided === token;
}

export async function GET(request: Request) {
  // Return 404 to avoid leaking that the endpoint exists.
  if (!isAllowed(request)) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  const cfg = getSftpConfigFromEnv();
  if (!cfg) {
    return NextResponse.json({
      ok: true,
      mode: "local",
      message: "No BLOG_SFTP_* set; using local filesystem under ./data/blog",
    });
  }

  const blogRoot = sftpBlogRoot(cfg);
  const categories = await withSftp(async (client) => {
    const list = await client.list(blogRoot);
    return (list as Array<{ type: string; name: string }>).filter((e) => e.type === "d").map((e) => e.name);
  });

  const sampleCategory = categories?.find((c) => c !== "uploads") ?? null;
  const sampleIds =
    sampleCategory
      ? await withSftp(async (client) => {
          const list = await client.list(path.posix.join(blogRoot, sampleCategory));
          return (list as Array<{ type: string; name: string }>).filter((e) => e.type === "d").map((e) => e.name).slice(0, 5);
        })
      : null;

  return NextResponse.json({
    ok: true,
    mode: "sftp",
    sftp: {
      host: mask(cfg.host),
      port: cfg.port,
      username: mask(cfg.username),
      basePath: "configured",
    },
    normalizedBlogRoot: blogRoot,
    categoriesCount: categories?.length ?? 0,
    categories: categories?.slice(0, 30) ?? [],
    sampleCategory,
    sampleIds,
    note: "If categories is empty, check BLOG_SFTP_BASE_PATH points to the folder that contains 'blog/'.",
  });
}
