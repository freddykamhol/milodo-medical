import path from "node:path";
import { readFile } from "node:fs/promises";

import { NextResponse } from "next/server";

import { sftpPathFromStorageKey, withSftp } from "@/lib/sftp";

export const runtime = "nodejs";

function contentTypeFromKey(key: string): string {
  const lower = key.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".avif")) return "image/avif";
  return "application/octet-stream";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = String(url.searchParams.get("key") ?? "").replaceAll("\\", "/");
  if (!key || key.includes("..") || key.startsWith("/")) {
    return NextResponse.json({ ok: false, error: "invalid_key" }, { status: 400 });
  }
  if (!key.startsWith("blog/")) {
    return NextResponse.json({ ok: false, error: "invalid_key" }, { status: 400 });
  }

  let bytes = await withSftp(async (client, cfg) => {
    const remotePath = sftpPathFromStorageKey(cfg, key);
    const raw = await client.get(remotePath);
    if (Buffer.isBuffer(raw)) return Uint8Array.from(raw);
    if (raw instanceof Uint8Array) return Uint8Array.from(raw);
    if (typeof raw === "string") return Uint8Array.from(Buffer.from(raw));
    throw new Error("sftp_download_failed");
  });

  if (!bytes) {
    const file = await readFile(path.join(process.cwd(), "data", key));
    bytes = Uint8Array.from(file);
  }

  return new Response(bytes.buffer, {
    headers: {
      "content-type": contentTypeFromKey(key),
      // blog images can be cached; purge via filename changes (UUID filenames in milodo-app).
      "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
