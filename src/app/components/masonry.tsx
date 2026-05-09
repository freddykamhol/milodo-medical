"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type MasonryOptions = {
  minColumns?: number;
  maxColumns?: number;
  gap?: number; // px
  preferredColumnWidth?: number; // px
};

type LayoutItem = {
  left: number;
  top: number;
  width: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function Masonry(props: MasonryOptions & { children: React.ReactNode[] }) {
  const {
    minColumns = 2,
    maxColumns = 5,
    gap = 16,
    preferredColumnWidth = 320,
  } = props;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [height, setHeight] = useState(0);

  const children = useMemo(() => props.children.filter(Boolean), [props.children]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;

    const compute = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const width = container.clientWidth;
        if (!width) return;

        const colsFromWidth = Math.floor((width + gap) / (preferredColumnWidth + gap));
        const columns = clamp(colsFromWidth || 1, minColumns, maxColumns);
        const colWidth = Math.floor((width - gap * (columns - 1)) / columns);

        const colHeights = new Array(columns).fill(0) as number[];
        const nextLayout: LayoutItem[] = [];

        for (let i = 0; i < children.length; i += 1) {
          const el = itemRefs.current[i];
          const h = el ? el.offsetHeight : 0;
          let col = 0;
          for (let c = 1; c < columns; c += 1) {
            if (colHeights[c]! < colHeights[col]!) col = c;
          }
          const left = col * (colWidth + gap);
          const top = colHeights[col]!;
          colHeights[col] = top + h + gap;
          nextLayout[i] = { left, top, width: colWidth };
        }

        setLayout(nextLayout);
        setHeight(Math.max(...colHeights, 0) - gap);
      });
    };

    const ro = new ResizeObserver(compute);
    ro.observe(container);
    for (const el of itemRefs.current) {
      if (el) ro.observe(el);
    }

    compute();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [children.length, gap, maxColumns, minColumns, preferredColumnWidth]);

  return (
    <div ref={containerRef} className="relative" style={{ height: Math.max(0, height) }}>
      {children.map((child, idx) => {
        const item = layout[idx];
        return (
          <div
            key={idx}
            ref={(el) => {
              itemRefs.current[idx] = el;
            }}
            className="absolute"
            style={
              item
                ? {
                    width: item.width,
                    transform: `translate3d(${item.left}px, ${item.top}px, 0)`,
                  }
                : { width: "100%" }
            }
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

