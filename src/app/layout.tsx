import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";
import { legalEntityFromEnv } from "@/lib/legal";

export const metadata: Metadata = {
  title: {
    default: "Milodo Medical Group",
    template: "%s · Milodo Medical",
  },
  description:
    "Personalvermittlung im Rettungsdienst (Börse) in Dortmund · Erste-Hilfe-Ausbildung · Sanitätsdienst.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Milodo Medical Group",
    title: "Milodo Medical Group",
    description:
      "Personalvermittlung im Rettungsdienst (Börse) in Dortmund · Erste-Hilfe-Ausbildung · Sanitätsdienst.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Milodo Medical Group",
    description:
      "Personalvermittlung im Rettungsdienst (Börse) in Dortmund · Erste-Hilfe-Ausbildung · Sanitätsdienst.",
  },
  icons: {
    icon: [{ url: "/logo/Logo.png", type: "image/png" }],
    apple: [{ url: "/logo/Logo.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "kontakt@milodo-medical.de";
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/g, "");
  const recaptchaSiteKey = String(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "").trim();
  const legal = legalEntityFromEnv();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: legal.companyName ?? "Milodo Medical Group",
    url: baseUrl,
    logo: `${baseUrl}/logo/Logo.png`,
    email: legal.email ?? undefined,
    telephone: legal.phone ?? undefined,
    address: legal.address
      ? {
          "@type": "PostalAddress",
          streetAddress: legal.address.split("\n")[0] ?? legal.address,
          addressCountry: "DE",
        }
      : undefined,
  };

  return (
    <html lang="de">
      <body>
        {recaptchaSiteKey ? (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(recaptchaSiteKey)}`}
            strategy="afterInteractive"
          />
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div id="top" />
        <SiteHeader variant="page" />
        {children}
        <SiteFooter contactEmail={contactEmail} />
      </body>
    </html>
  );
}
