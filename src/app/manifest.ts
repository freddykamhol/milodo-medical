import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  const base = siteUrl();

  return {
    name: "Milodo Medical Group",
    short_name: "Milodo Medical",
    description:
      "Personalvermittlung im Rettungsdienst in NRW, Erste-Hilfe-Ausbildung und Sanitätsdienst.",
    start_url: base,
    scope: base,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "de",
    icons: [
      {
        src: `${base}/logo/Logo.png`,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
