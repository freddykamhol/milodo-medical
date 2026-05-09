"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import Lightbox, { type LightboxState } from "./lightbox";
import Masonry from "@/app/components/masonry";

export default function PostBody(props: { html: string; postTitle: string }) {
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [masonryImages, setMasonryImages] = useState<string[]>([]);
  const [masonryMount, setMasonryMount] = useState<HTMLElement | null>(null);
  const articleRef = useRef<HTMLElement | null>(null);

  const content = useMemo(() => ({ __html: props.html }), [props.html]);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    const existing = article.querySelector<HTMLElement>("[data-post-masonry=\"true\"]");
    if (existing) {
      const raw = existing.getAttribute("data-post-masonry-srcs") || "[]";
      const srcs = (() => {
        try {
          const parsed = JSON.parse(raw) as unknown;
          if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
          return [];
        } catch {
          return [];
        }
      })();
      setMasonryImages(srcs);
      setMasonryMount(existing);

      const images = Array.from(article.querySelectorAll("img"))
        .map((img) => img.getAttribute("src") || "")
        .filter(Boolean);
      setGallery(images);
      return;
    }

    // Find first "image-only" group and render it as a masonry gallery above the article.
    // We inject a placeholder at the correct position and render React Masonry into it.
    const children = Array.from(article.children);
    const extractImages = (el: Element): HTMLImageElement[] => {
      const images: HTMLImageElement[] = [];
      const nodeImages = Array.from(el.querySelectorAll("img"));
      for (const img of nodeImages) {
        if (img instanceof HTMLImageElement) images.push(img);
      }
      return images;
    };

    const isImageOnlyParagraph = (el: Element) => {
      if (el.tagName.toLowerCase() !== "p") return false;
      const images = extractImages(el);
      if (images.length === 0) return false;

      // Allow only whitespace text nodes and elements that contain images (img, a>img).
      for (const node of Array.from(el.childNodes)) {
        if (node.nodeType === Node.TEXT_NODE) {
          if ((node.textContent || "").trim().length) return false;
          continue;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return false;
        const elem = node as Element;
        const tag = elem.tagName.toLowerCase();
        if (tag === "img") continue;
        if (tag === "a" && elem.querySelector("img")) continue;
        if (tag === "br") continue;
        return false;
      }
      return true;
    };

    let idx = 0;
    let picked: { srcs: string[]; elements: Element[] } | null = null;
    while (idx < children.length) {
      const current = children[idx];
      if (!current || !isImageOnlyParagraph(current)) {
        idx += 1;
        continue;
      }

      const group: Element[] = [];
      let j = idx;
      while (j < children.length && isImageOnlyParagraph(children[j]!)) {
        group.push(children[j]!);
        j += 1;
      }

      // Only transform if we have at least 2 image paragraphs (gallery feel).
      const groupImages = group.flatMap((p) => extractImages(p));
      if (!picked && groupImages.length >= 2) {
        const srcs = groupImages.map((img) => img.getAttribute("src") || "").filter(Boolean);
        picked = { srcs, elements: group };
      }

      idx = j;
    }

    if (picked) {
      setMasonryImages(picked.srcs);
      const placeholder = document.createElement("div");
      placeholder.setAttribute("data-post-masonry", "true");
      placeholder.setAttribute("data-post-masonry-srcs", JSON.stringify(picked.srcs));
      // Replace first element in the group with placeholder, remove the rest.
      picked.elements[0]!.replaceWith(placeholder);
      for (let i = 1; i < picked.elements.length; i += 1) picked.elements[i]!.remove();
      setMasonryMount(placeholder);
    } else {
      setMasonryImages([]);
      setMasonryMount(null);
    }

    // Collect all images after transformations to build a stable list for the lightbox.
    const images = Array.from(article.querySelectorAll("img"))
      .map((img) => img.getAttribute("src") || "")
      .filter(Boolean);
    setGallery(images);
  }, [props.html]);

  return (
    <>
      <Lightbox
        key={lightbox ? `${lightbox.src}|${lightbox.index ?? 0}` : "closed"}
        state={lightbox}
        onClose={() => setLightbox(null)}
      />
      <article
        ref={(el) => {
          articleRef.current = el;
        }}
        className="markdown-content mt-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]"
        // sanitized via rehype-sanitize in markdownToHtml()
        dangerouslySetInnerHTML={content}
        onClick={(event) => {
          const target = event.target;
          if (!(target instanceof HTMLImageElement)) return;
          const src = target.getAttribute("src") || "";
          if (!src) return;

          const index = gallery.indexOf(src);
          setLightbox({
            src,
            title: target.getAttribute("alt") || props.postTitle,
            gallery: gallery.length ? gallery : undefined,
            index: index >= 0 ? index : undefined,
          });
        }}
      />
      {masonryMount && masonryImages.length
        ? createPortal(
            <div className="my-6">
              <Masonry minColumns={2} maxColumns={5} gap={16} preferredColumnWidth={260}>
                {masonryImages.map((src, idx) => (
                  <button
                    key={`${src}-${idx}`}
                    type="button"
                    className="group block w-full overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]"
                    onClick={() =>
                      setLightbox({
                        src,
                        title: props.postTitle,
                        gallery,
                        index: gallery.indexOf(src),
                      })
                    }
                    aria-label="Bild öffnen"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="w-full object-cover transition duration-500 will-change-transform group-hover:scale-[1.03] group-hover:[filter:blur(0.6px)]"
                      loading="lazy"
                    />
                  </button>
                ))}
              </Masonry>
            </div>,
            masonryMount,
          )
        : null}
    </>
  );
}
