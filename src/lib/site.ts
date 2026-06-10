export const DEFAULT_SITE_URL = "https://milodo-medical.de";

function isLocalUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1";
  } catch {
    return false;
  }
}

export function siteUrl(): string {
  const configuredUrl =
    String(process.env.SITE_URL ?? "").trim() || String(process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  const fallbackUrl = process.env.NODE_ENV === "production" ? DEFAULT_SITE_URL : "http://localhost:3000";
  const url = configuredUrl || fallbackUrl;

  if (process.env.NODE_ENV === "production" && isLocalUrl(url)) {
    return DEFAULT_SITE_URL;
  }

  return url.replace(/\/+$/g, "");
}
