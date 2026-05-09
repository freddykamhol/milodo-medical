import SftpClient from "ssh2-sftp-client";
import path from "node:path";

export type SftpConfig = {
  host: string;
  port: number;
  username: string;
  password?: string;
  basePath: string; // remote base dir (the "data" dir on the server)
};

export function getSftpConfigFromEnv(): SftpConfig | null {
  const host = String(process.env.BLOG_SFTP_HOST ?? "").trim();
  const username = String(process.env.BLOG_SFTP_USER ?? "").trim();
  const basePath = String(process.env.BLOG_SFTP_BASE_PATH ?? "").trim();
  if (!host || !username || !basePath) return null;

  const portRaw = Number(process.env.BLOG_SFTP_PORT ?? "22");
  const port = Number.isFinite(portRaw) ? portRaw : 22;

  const password = String(process.env.BLOG_SFTP_PASSWORD ?? "").trim() || undefined;

  return {
    host,
    port,
    username,
    password,
    basePath: basePath.replace(/\/+$/g, ""),
  };
}

export async function withSftp<T>(fn: (client: SftpClient, config: SftpConfig) => Promise<T>) {
  const config = getSftpConfigFromEnv();
  if (!config) return null;

  const client = new SftpClient();
  try {
    await client.connect({
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      readyTimeout: 12_000,
    });
    return await fn(client, config);
  } finally {
    await client.end().catch(() => undefined);
  }
}

export function sftpBlogRoot(config: SftpConfig): string {
  // Some users set basePath to ".../data", others to ".../data/blog".
  // Normalize to always return ".../data/blog".
  const base = config.basePath.replace(/\/+$/g, "");
  if (base.toLowerCase().endsWith("/blog")) return base;
  return path.posix.join(base, "blog");
}

export function sftpPathFromStorageKey(config: SftpConfig, key: string): string {
  const cleanedKey = String(key || "").replaceAll("\\", "/").replace(/^\/+/, "");
  const base = config.basePath.replace(/\/+$/g, "");

  // If basePath already ends with /blog, strip leading "blog/" from key to avoid ".../blog/blog/...".
  const normalizedKey =
    base.toLowerCase().endsWith("/blog") && cleanedKey.toLowerCase().startsWith("blog/")
      ? cleanedKey.slice(5)
      : cleanedKey;

  return path.posix.join(base, normalizedKey);
}
