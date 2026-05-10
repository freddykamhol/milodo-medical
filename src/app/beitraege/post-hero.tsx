import Link from "next/link";

import { formatDateDE } from "@/lib/format";

export default function PostHero(props: {
  title: string;
  date: string;
  coverImage?: string;
  excerpt?: string;
  category?: string;
  readingTimeMinutes?: number;
}) {
  return (
    <section className="relative">
      <div className="relative h-[56vh] min-h-[420px] w-full overflow-hidden md:h-[68vh]">
        {props.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={props.coverImage}
            alt={props.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--accent)_32%,transparent)_0%,transparent_58%)]" />
        )}

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/45 via-black/18 to-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,color-mix(in_oklab,var(--accent)_38%,transparent)_0%,transparent_55%)] opacity-70" />
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.16)_1px,transparent_0)] [background-size:22px_22px] opacity-[0.18]" />

        {/* Left-to-right glass veil + soft fade to page background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/14 via-black/8 to-[var(--background)]/98" />
        </div>

        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-6xl flex-col px-6 pb-10 pt-10 md:pb-12 md:pt-12">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/beitraege"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-sm font-semibold text-white/90 backdrop-blur hover:bg-black/35"
              >
                ← Alle Beiträge
              </Link>

              <div className="hidden items-center gap-2 sm:flex">
                <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs font-semibold text-white/85 backdrop-blur">
                  Blog
                </span>
                {props.category ? (
                  <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs font-semibold text-white/85 backdrop-blur">
                    {props.category}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex-1" />

            <div className="mx-auto w-full max-w-4xl">
              <div className="rounded-[28px] border border-white/14 bg-white/10 p-6 text-center shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-10">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/15 px-3 py-1 text-xs font-semibold text-white/90">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    {formatDateDE(props.date)}
                  </span>
                  {props.readingTimeMinutes ? (
                    <span className="rounded-full border border-white/14 bg-black/15 px-3 py-1 text-xs font-semibold text-white/90">
                      {props.readingTimeMinutes} min Lesezeit
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white md:text-6xl">
                  {props.title}
                </h1>

                {props.excerpt ? (
                  <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/82 md:text-base">
                    {props.excerpt}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
