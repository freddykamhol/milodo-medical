import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VerifyResponse = {
  ok: boolean;
  skipped?: boolean;
  score?: number;
  action?: string;
  error?: string;
};

export async function POST(req: Request) {
  const secret = String(process.env.RECAPTCHA_SECRET_KEY ?? "").trim();
  if (!secret) {
    const isProd = process.env.NODE_ENV === "production";
    const payload: VerifyResponse = isProd
      ? { ok: false, error: "missing_secret" }
      : { ok: true, skipped: true };
    return NextResponse.json(payload, { status: isProd ? 500 : 200 });
  }

  const body = (await req.json().catch(() => null)) as
    | { token?: unknown; action?: unknown; remoteip?: unknown }
    | null;
  const token = String(body?.token ?? "").trim();
  const expectedAction = String(body?.action ?? "").trim();
  const remoteip = String(body?.remoteip ?? "").trim();

  if (!token) {
    return NextResponse.json<VerifyResponse>({ ok: false, error: "missing_token" }, { status: 400 });
  }

  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token);
  if (remoteip) form.set("remoteip", remoteip);

  const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form.toString(),
    cache: "no-store",
  }).catch(() => null);

  if (!verifyRes?.ok) {
    return NextResponse.json<VerifyResponse>({ ok: false, error: "verify_failed" }, { status: 502 });
  }

  const json = (await verifyRes.json().catch(() => null)) as
    | {
        success?: boolean;
        score?: number;
        action?: string;
        "error-codes"?: string[];
      }
    | null;

  const success = Boolean(json?.success);
  const action = typeof json?.action === "string" ? json.action : undefined;
  const score = typeof json?.score === "number" ? json.score : undefined;

  if (!success) {
    return NextResponse.json<VerifyResponse>(
      { ok: false, score, action, error: "recaptcha_not_successful" },
      { status: 403 },
    );
  }

  if (expectedAction && action && action !== expectedAction) {
    return NextResponse.json<VerifyResponse>(
      { ok: false, score, action, error: "action_mismatch" },
      { status: 403 },
    );
  }

  const minScore = Number.parseFloat(String(process.env.RECAPTCHA_MIN_SCORE ?? "0.5"));
  if (Number.isFinite(minScore) && typeof score === "number" && score < minScore) {
    return NextResponse.json<VerifyResponse>(
      { ok: false, score, action, error: "score_too_low" },
      { status: 403 },
    );
  }

  return NextResponse.json<VerifyResponse>({ ok: true, score, action });
}

