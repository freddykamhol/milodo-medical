import { NextResponse } from "next/server";

import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getPortalUrl() {
  const raw =
    String(process.env.PORTAL_URL ?? "").trim() ||
    String(process.env.NEXT_PUBLIC_PORTAL_URL ?? "").trim() ||
    "https://portal.milodo-medical.de";
  return raw.replace(/\/+$/g, "");
}

function getSourceOrigin(req: Request) {
  const configured =
    String(process.env.SITE_URL ?? "").trim() ||
    String(process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  if (configured) return siteUrl();

  const proto = req.headers.get("x-forwarded-proto");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (proto && host) return `${proto}://${host}`.replace(/\/+$/g, "");
  return null;
}

export async function POST(req: Request) {
  const portalUrl = getPortalUrl();
  const endpoint = `${portalUrl}/api/public/contact-inquiries`;

  const bodyText = await req.text().catch(() => "");
  const sourceOrigin = getSourceOrigin(req);

  const forwardRes = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      // Some backends apply allowlists based on Origin/Referer even for "public" endpoints.
      ...(sourceOrigin ? { origin: sourceOrigin, referer: `${sourceOrigin}/` } : {}),
    },
    body: bodyText,
    cache: "no-store",
  }).catch(() => null);

  if (!forwardRes) {
    return NextResponse.json({ ok: false, error: "portal_unreachable" }, { status: 502 });
  }

  const contentType = forwardRes.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const json = await forwardRes.json().catch(() => null);
    return NextResponse.json(json, { status: forwardRes.status });
  }

  const text = await forwardRes.text().catch(() => "");
  return NextResponse.json({ ok: forwardRes.ok, status: forwardRes.status, body: text }, { status: forwardRes.status });
}
