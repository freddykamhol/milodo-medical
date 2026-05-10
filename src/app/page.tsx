import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import ContactForm from "./contact-form";
import BlogCarousel from "./blog-carousel";
import ScrollFx from "./scroll-fx";
import { getLatestBlogPostsMeta } from "@/lib/blog";

export const runtime = "nodejs";

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@milodo-medical.de";

const HOME_IMAGES = {
  hero: "/images/home/hero2.png",
  borse: "/images/home/boerse.png",
  firstAid: "/images/home/erste-hilfe.png",
  sanitaet: "/images/home/sanitaetsdienst.png",
} as const;

const CLIENTS = [
  "Krankentransport Dienst Arnold Wesche GmbH",
  "Medical Transport Service GmbH",
  "AMS und Bonimed Sanitätsdienste",
  "BFZ Essen GmbH",
  "Dekra Akademie Gelsenkirchen GmbH",
  "DRK Gelsenkirchen e.V.",
  "SKS Ambulanz gGmbH",
] as const;

const SERVICES = [
  {
    title: "Betriebliche Erste-Hilfe-Ausbildung",
    description:
      "Praxisnah, verständlich und auf euren Betrieb zugeschnitten – damit Mitarbeitende im Ernstfall sicher handeln können.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="h-6 w-6"
      >
        <path
          d="M10 7h4v10h-4V7Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M7 10h10v4H7v-4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M12 21c5 0 9-4 9-9S17 3 12 3 3 7 3 12s4 9 9 9Z"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.55"
        />
      </svg>
    ),
  },
  {
    title: "Notfalltraining – Arztpraxen & Pflege",
    description:
      "Team-Training für den Praxis- und Pflegealltag: klare Rollen, strukturierte Abläufe und sicheres Handeln in kritischen Situationen.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="h-6 w-6"
      >
        <path
          d="M12 3 20 7v6c0 5-3.6 9.4-8 10-4.4-.6-8-5-8-10V7l8-4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M12 8v8m-4-4h8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Personalvermittlung (Börse) – Rettungsdienst",
    description:
      "Wenn Schichten offen bleiben, zählt Tempo: Wir vermitteln kurzfristig passendes Personal für den Rettungsdienst – in NRW, klar abgestimmt und zuverlässig umgesetzt.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="h-6 w-6"
      >
        <path
          d="M7 18h6m-9-7h16m-5 7h1a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h1"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M9.5 8.5h5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Sanitätsdienst",
    description:
      "Medizinische Absicherung für Veranstaltungen: sichtbar präsent, professionell organisiert und einsatzbereit – damit du dich auf dein Event konzentrieren kannst.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="h-6 w-6"
      >
        <path
          d="M12 2 20 6v6c0 5-3.6 9.4-8 10-4.4-.6-8-5-8-10V6l8-4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M12 7v8m-4-4h8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
] as const;

const VALUE_PROPS = [
  {
    title: "Fokus NRW",
    description:
      "Kurze Wege, klare Abläufe: Wir sind auf NRW ausgerichtet und reagieren schnell.",
  },
  {
    title: "Praxisnah im Team",
    description:
      "Training mit echten Szenarien und klaren Rollen – passend für Betrieb, Arztpraxis oder Pflegeeinrichtung.",
  },
  {
    title: "Professionell im Einsatz",
    description:
      "Ruhig, präsent, zuverlässig – vom ersten Kontakt bis zur Umsetzung vor Ort.",
  },
  {
    title: "Abläufe, die sitzen",
    description:
      "Struktur statt Stress: Wir helfen, Notfallabläufe verständlich zu üben und nachhaltig zu verankern.",
  },
] as const;

const STEPS = [
  {
    title: "Unverbindlich anfragen",
    description:
      "Sag uns kurz, was du brauchst: Thema, Zielgruppe (Betrieb/Praxis/Pflege), Ort (NRW) und Umfang.",
  },
  {
    title: "Schnell matchen",
    description:
      "Wir klären Inhalte, Dauer und Rahmenbedingungen – und stimmen das Vorgehen transparent ab.",
  },
  {
    title: "Sauber umsetzen",
    description:
      "Vor Ort, strukturiert und professionell – ob betriebliche EH-Ausbildung, Notfalltraining oder Einsatzdienst.",
  },
] as const;

function revealDelayStyle(ms: number): CSSProperties {
  return { ["--reveal-delay" as string]: `${ms}ms` } as CSSProperties;
}

function SectionHeader(props: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div data-reveal className="max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)] shadow-[var(--shadow)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
        {props.kicker}
      </div>
      <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight md:text-3xl">
        {props.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
        {props.subtitle}
      </p>
    </div>
  );
}

export default async function HomePage() {
  const latestPosts = await getLatestBlogPostsMeta(7);
  const latestPost = latestPosts[0];
  return (
    <main
      className="relative min-h-dvh bg-[var(--background)] text-[var(--foreground)]"
    >
      <ScrollFx />
      <div aria-hidden="true" className="scroll-progress" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="fx-glow absolute -top-52 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-[0.16] blur-[130px]" />
        <div className="fx-glow fx-glow-2 absolute -bottom-80 right-[-240px] h-[760px] w-[760px] rounded-full bg-[var(--accent)] opacity-[0.10] blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.45] [background-image:radial-gradient(circle_at_1px_1px,color-mix(in_oklab,var(--foreground)_12%,transparent)_1px,transparent_0)] [background-size:18px_18px]" />
      </div>

      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-10 md:pb-14 md:pt-14">
          <div className="grid items-center gap-10 md:grid-cols-12">
            <div data-reveal className="md:col-span-7">
	              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)] shadow-[var(--shadow)]">
	                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
	                Betriebliche Erste Hilfe · Notfalltraining · NRW
	              </div>
              <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
                Sicher handeln im{" "}
                <span className="text-[var(--accent)]">Notfall</span>.
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-[color:var(--muted)] md:text-lg">
                Wir unterstützen Unternehmen, Einrichtungen und Veranstalter in ganz NRW mit zuverlässigen medizinischen Dienstleistungen und praxisnahen Schulungskonzepten.
                <br />Wir sorgen dafür, dass Teams im Notfall wissen, was zu tun ist – mit betrieblicher Erste-Hilfe-Ausbildung und individuell angepassten Notfalltrainings für Arztpraxen, Pflegeeinrichtungen und Unternehmen.
                <br />Darüber hinaus unterstützen wir Rettungsdienste und Krankentransporte bei kurzfristigen oder planbaren Personallücken durch unser Netzwerk qualifizierter Fachkräfte. Auch bei Veranstaltungen stehen wir Ihnen mit professionellen Sanitätsdiensten zur Seite – zuverlässig, strukturiert und persönlich betreut.
                <br />Unser Anspruch ist es, nicht einfach nur eine Dienstleistung anzubieten, sondern echte Entlastung zu schaffen – mit klarer Kommunikation, flexibler Planung und einem starken Team im Hintergrund.
                <br />MILODO Medical Group – damit Sicherheit planbar wird.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  className="inline-flex items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow)] hover:opacity-90"
                  href="#kontakt"
                >
                  Jetzt unverbindlich anfragen
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--surface-2)]"
                  href="#leistungen"
                >
                  Angebote ansehen
                </a>
              </div>

	              <div className="mt-8 flex flex-wrap gap-2">
	                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[color:var(--muted)]">
	                  Inhouse · NRW
	                </span>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[color:var(--muted)]">
                  Betriebliche Erste Hilfe
                </span>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[color:var(--muted)]">
                  Notfalltraining (Praxis & Pflege)
                </span>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[color:var(--muted)]">
                  Einsatzdienst (Börse/Sanität)
                </span>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
                <div
                  data-reveal
                  className="relative isolate overflow-hidden rounded-3xl [transform:translateZ(0)]"
                >
                  <div
                    data-parallax
                    data-parallax-speed="0.18"
                    data-zoom
                    data-zoom-from="1.08"
                    data-zoom-to="1.04"
                  >
                    <Image
                      src={HOME_IMAGES.hero}
                      alt="Milodo Medical Group – Hero Bild"
                      width={1600}
                      height={1100}
                      priority
                      sizes="(max-width: 768px) 100vw, 42vw"
                      className="h-[340px] w-full object-cover md:h-[420px] [transform:translateZ(0)] [backface-visibility:hidden]"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/55 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]" />
                  <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_-60px_120px_rgba(255,255,255,0.65)]" />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,1)_0%,rgba(255,255,255,0.85)_10%,rgba(255,255,255,0)_36%)]" />

                  <div className="absolute bottom-4 left-4 right-4 grid gap-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-2xl border border-[var(--border)] bg-white/85 px-3 py-2 text-xs font-semibold text-[color:var(--muted)] backdrop-blur">
                        Erste Hilfe Kurse
                      </div>
                      <div className="rounded-2xl border border-[var(--border)] bg-white/85 px-3 py-2 text-xs font-semibold text-[color:var(--muted)] backdrop-blur">
                        Notfalltraining
                      </div>
                      <div className="rounded-2xl border border-[var(--border)] bg-white/85 px-3 py-2 text-xs font-semibold text-[color:var(--muted)] backdrop-blur">
                        Personal
                      </div>
                    </div>
                  </div>
                </div>

	                <div className="p-6">
	                  <div
	                    className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--surface)_90%,white)_0%,var(--surface-2)_100%)] p-4 shadow-[var(--shadow)]"
	                    data-reveal
	                    style={revealDelayStyle(90)}
	                  >
	                    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[color-mix(in_oklab,var(--accent)_22%,transparent)] blur-2xl" />
	                    <div className="flex items-center justify-between gap-4">
	                      <div className="min-w-0">
	                        <div className="text-sm font-semibold tracking-tight">Aktuelles</div>
	                        <div className="mt-0.5 text-xs text-[color:var(--muted)]">
	                          Neuester Beitrag aus dem Blog
	                        </div>
	                      </div>
	                      <span className="shrink-0 rounded-full border border-[color-mix(in_oklab,var(--accent)_28%,var(--border))] bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-[color:var(--muted)] backdrop-blur">
	                        Live
	                      </span>
	                    </div>

	                    <div className="mt-4">
	                      <div className="logo-marquee rounded-2xl border border-[var(--border)] bg-white/70">
	                        <div
	                          className="logo-marquee-track flex w-max flex-nowrap items-center gap-5 px-4 py-2 [animation:logo-marquee_var(--marquee-duration,20s)_linear_infinite]"
	                          style={{ ["--marquee-duration" as string]: "20s" }}
	                        >
	                          <Link
	                            href={latestPost ? `/beitraege/${latestPost.slug}` : "/beitraege"}
	                            className="inline-flex items-center gap-2 whitespace-nowrap text-xs font-semibold tracking-tight text-[color:var(--muted)] hover:text-[var(--foreground)]"
	                          >
	                            <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--accent)_30%,var(--border))] bg-[color-mix(in_oklab,var(--accent)_10%,white)] px-2.5 py-1 text-[11px] font-semibold text-[var(--accent)]">
	                              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
	                              Aktuell:
	                            </span>
	                            <span className="max-w-[420px] truncate">
	                              {latestPost?.title ?? "Neue Beiträge folgen in Kürze"}
	                            </span>
	                            <span aria-hidden="true" className="text-[color:var(--muted)]">
	                              →
	                            </span>
	                          </Link>
	                          <span
	                            aria-hidden="true"
	                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-[color-mix(in_oklab,var(--foreground)_18%,transparent)]"
	                          />
	                          <Link
	                            href="/beitraege"
	                            className="inline-flex items-center gap-2 whitespace-nowrap text-xs font-semibold tracking-tight text-[color:var(--muted)] hover:text-[var(--foreground)]"
	                          >
	                            <span className="rounded-full border border-[var(--border)] bg-white/60 px-2.5 py-1 text-[11px] font-semibold text-[color:var(--muted)] backdrop-blur">
	                              Blog
	                            </span>
	                            <span>Alle Beiträge ansehen</span>
	                            <span aria-hidden="true" className="text-[color:var(--muted)]">
	                              →
	                            </span>
	                          </Link>
	                        </div>
	                      </div>
	                    </div>
	                  </div>
	                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 pb-12">
          <div className="grid gap-4 md:grid-cols-4">
            {VALUE_PROPS.map((item, index) => (
              <div
                key={item.title}
                className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]"
                data-reveal
                style={revealDelayStyle(index * 70)}
              >
                <div className="text-sm font-semibold tracking-tight">
                  {item.title}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="bilder" className="relative scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 pb-12">
          <SectionHeader
            kicker="Impressionen"
            title="Zeig Vertrauen. Zeig Qualität."
            subtitle="Einblicke in unsere Arbeit: betriebliche Erste Hilfe, Notfalltrainings (Praxis & Pflege) sowie Einsatzdienst."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
              <div className="relative" data-reveal>
                <div data-zoom data-zoom-from="1.12" data-zoom-to="1">
                  <Image
                    src={HOME_IMAGES.borse}
                    alt="Rettungsdienst-Börse"
                    width={1200}
                    height={900}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03] md:h-64"
                  />
                </div>
              </div>
              <div className="p-5">
                <div className="text-sm font-semibold tracking-tight">
                  Rettungsdienst-Börse
                </div>
	                <div className="mt-1 text-sm text-[color:var(--muted)]">
	                  Schnelle Besetzung in NRW.
	                </div>
              </div>
            </div>

            <div className="group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
              <div
                className="relative"
                data-reveal
                style={revealDelayStyle(90)}
              >
                <div data-zoom data-zoom-from="1.12" data-zoom-to="1">
                  <Image
                    src={HOME_IMAGES.firstAid}
                    alt="Betriebliche Erste Hilfe und Notfalltraining"
                    width={1200}
                    height={900}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03] md:h-64"
                  />
                </div>
              </div>
              <div className="p-5">
                <div className="text-sm font-semibold tracking-tight">
                  Betriebliche EH & Notfalltraining
                </div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">
                  Szenarien, die wirklich sitzen.
                </div>
              </div>
            </div>

            <div className="group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
              <div
                className="relative"
                data-reveal
                style={revealDelayStyle(180)}
              >
                <div data-zoom data-zoom-from="1.12" data-zoom-to="1">
                  <Image
                    src={HOME_IMAGES.sanitaet}
                    alt="Sanitätsdienst"
                    width={1200}
                    height={900}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03] md:h-64"
                  />
                </div>
              </div>
              <div className="p-5">
                <div className="text-sm font-semibold tracking-tight">
                  Sanitätsdienst
                </div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">
                  Absicherung, auf die du dich verlassen kannst.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="leistungen" className="relative scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <SectionHeader
            kicker="Leistungen"
            title="Leistungen, die Ergebnisse liefern."
            subtitle="Von betrieblicher Erste-Hilfe-Ausbildung bis Notfalltraining für Praxis & Pflege – plus Einsatzdienst, wenn es schnell gehen muss."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service, index) => (
              <div
                key={service.title}
                className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]"
                data-reveal
                style={revealDelayStyle(index * 90)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--accent)]">
                    {service.icon}
                  </div>
                  <div className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-xs font-semibold text-[color:var(--muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
                <h3 className="mt-4 text-sm font-semibold tracking-tight">
                  {service.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ablauf" className="relative scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <SectionHeader
                kicker="Ablauf"
                title="In 3 Schritten zur Lösung."
                subtitle="Kurz anfragen, schnell matchen, sauber umsetzen – ohne Umwege."
              />
            </div>
            <div className="md:col-span-7">
              <div className="grid gap-4">
                {STEPS.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]"
                    data-reveal
                    style={revealDelayStyle(index * 90)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-sm font-semibold tracking-tight">
                        {step.title}
                      </div>
                      <div className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                        Schritt {index + 1}
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="group relative isolate overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] [transform:translateZ(0)]">
            <div data-reveal className="relative">
              <div
                data-parallax
                data-parallax-speed="0.22"
                data-zoom
                data-zoom-from="1.16"
                data-zoom-to="1.06"
              >
                <Image
                  src={HOME_IMAGES.firstAid}
                  alt="Impressionen"
                  width={1600}
                  height={1100}
                  sizes="(max-width: 768px) 100vw, 1000px"
                  className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-[1.02] md:h-[360px] [transform:translateZ(0)] [backface-visibility:hidden]"
                />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/97 via-white/65 to-white/25" />
            <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,1)_0%,rgba(255,255,255,0.85)_10%,rgba(255,255,255,0)_36%)]" />
            <div className="absolute inset-0 flex items-end">
              <div className="w-full p-6 md:p-10">
                <div className="max-w-xl">
	                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/75 px-3 py-1 text-xs font-semibold text-[color:var(--muted)] backdrop-blur">
	                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
	                    Inhouse-Training · NRW
	                  </div>
                  <div className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
                    Notfalltraining, das euer Team stärkt.
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
                    Kurze Anfrage genügt. Wir melden uns zeitnah mit Vorschlag
                    für Inhalte, Dauer und Umsetzung – passend für Arztpraxis,
                    Pflegeeinrichtung oder Betrieb.
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      className="inline-flex items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow)] hover:opacity-90"
                      href="#kontakt"
                    >
                      Anfrage senden
                    </a>
                    <a
                      className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-white/75 px-5 py-3 text-sm font-semibold text-[var(--foreground)] backdrop-blur hover:bg-white"
                      href="#bilder"
                    >
                      Impressionen
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="kunden" className="relative scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <SectionHeader
            kicker="Kunden & Partner"
            title="Namen, die Vertrauen schaffen."
            subtitle="Ein Auszug unserer Kunden und Partner aus dem Rettungsdienst- und Medizin-Umfeld."
          />
        </div>

	        <div className="w-full" data-reveal>
	          <div className="logo-marquee border-y border-[var(--border)] bg-[var(--surface)]">
	            <div
	              className="logo-marquee-track flex w-max flex-nowrap items-center gap-3 px-6 py-4 [animation:logo-marquee_var(--marquee-duration,36s)_linear_infinite]"
	              style={{ ["--marquee-duration" as string]: "36s" }}
            >
              {[...CLIENTS, ...CLIENTS].map((name, index) => (
                <div
                  key={`${name}-${index}`}
                  className="whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold tracking-tight text-[color:var(--muted)]"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="beitraege" className="relative scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <SectionHeader
            kicker="Blog"
            title="Das passiert bei uns."
            subtitle="Neuigkeiten, Einblicke und Updates aus unserem Alltag."
          />

          <BlogCarousel items={latestPosts} />
        </div>
      </section>

      <section id="kontakt" className="relative scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="rounded-3xl border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-2)_100%)] p-8 shadow-[var(--shadow)] md:p-10">
            <div className="grid items-start gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Kurze Anfrage. Schnelle Antwort.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
                  Schreib uns kurz, was du brauchst (betriebliche EH-Ausbildung,
                  Notfalltraining für Praxis/Pflege oder Einsatzdienst) – wir
                  melden uns zeitnah mit einer klaren Einschätzung zurück.
                </p>
                <div className="mt-4 text-xs text-[color:var(--muted)]">
                  Alternativ direkt per Mail:{" "}
                  <a
                    className="font-mono underline decoration-[color-mix(in_oklab,var(--accent)_55%,transparent)] underline-offset-4 hover:text-[var(--foreground)]"
                    href={`mailto:${CONTACT_EMAIL}`}
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
              <div className="min-w-0 lg:col-span-8">
	                <ContactForm toEmail={CONTACT_EMAIL} />
	              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
