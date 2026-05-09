import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { Schema } from "hast-util-sanitize";

const schema: Schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [
      ...(defaultSchema.attributes?.a ?? []),
      ["target", "_blank"],
      ["rel", "noopener noreferrer"],
    ],
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      "src",
      "alt",
      "title",
      "width",
      "height",
      "loading",
      "decoding",
    ],
  },
} as unknown as Schema;

function encodeSpacesInMarkdownUrls(markdown: string): string {
  // CommonMark breaks image/link URLs on spaces. milodo-app stored filenames may include spaces,
  // e.g. "WhatsApp Image ... .jpeg". Encode spaces inside the (...) URL part for images/links.
  return markdown.replace(/(!?\[[^\]]*]\()([^)]+)(\))/g, (_m, start: string, url: string, end: string) => {
    const raw = String(url);
    if (raw.trimStart().startsWith("<") && raw.trimEnd().endsWith(">")) return `${start}${raw}${end}`;
    const match = raw.match(/^(\S+)(\s+(['"]).*)$/);
    const urlPart = match ? match[1] : raw;
    const titlePart = match ? match[2] : "";
    const rewritten =
      urlPart.startsWith("/blog/")
        ? `/api/blog/assets/raw?key=${encodeURIComponent(urlPart.replace(/^\/+/, ""))}`
        : urlPart;
    const encoded = rewritten.replaceAll(" ", "%20");
    return `${start}${encoded}${titlePart}${end}`;
  });
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize, schema)
    .use(rehypeStringify)
    .process(encodeSpacesInMarkdownUrls(markdown));
  return String(file);
}
