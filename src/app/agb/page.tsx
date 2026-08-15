import fs from "node:fs";
import path from "node:path";

import LegalPage from "@/app/components/legal-page";

type AgbSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

function readAgb(): { intro: string[]; sections: AgbSection[] } {
  const source = fs.readFileSync(path.join(process.cwd(), "data", "agb-b2b.txt"), "utf8").trim();
  const sectionPattern = /^§ (\d+) (.+)$/gm;
  const matches = [...source.matchAll(sectionPattern)];
  const introEnd = matches[0]?.index ?? source.length;
  const intro = source.slice(0, introEnd).trim().split(/\r?\n/).filter(Boolean);

  const sections = matches.map((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const end = matches[index + 1]?.index ?? source.length;

    return {
      id: `paragraph-${match[1]}`,
      title: `§ ${match[1]} ${match[2]}`,
      paragraphs: source.slice(start, end).trim().split(/\r?\n\s*\r?\n/).filter(Boolean),
    };
  });

  return { intro, sections };
}

export default function AgbPage() {
  const { intro, sections } = readAgb();

  return (
    <LegalPage
      title="Allgemeine Geschäftsbedingungen"
      lead="Allgemeine Geschäftsbedingungen der MILODO Medical Group für Geschäftskunden (B2B)."
      toc={sections.map((section) => ({ href: `#${section.id}`, label: section.title }))}
    >
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5 text-sm leading-relaxed text-[color:var(--muted)]">
        {intro.map((line, index) => (
          <div
            key={`${line}-${index}`}
            className={index === 0 ? "font-semibold text-[var(--foreground)]" : undefined}
          >
            {line}
          </div>
        ))}
      </section>

      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-[calc(var(--scroll-offset)+18px)] grid gap-3 text-sm leading-relaxed text-[color:var(--muted)]"
        >
          <h2 className="text-base font-semibold text-[var(--foreground)]">{section.title}</h2>
          {section.paragraphs.map((paragraph, index) => (
            <p key={index} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </LegalPage>
  );
}
