import type { Metadata } from "next";

import "./globals.css";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";
import CookieConsent from "./cookie-consent";
import RecaptchaScript from "./recaptcha-script";
import { legalEntityFromEnv } from "@/lib/legal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Milodo Medical Group",
    template: "%s · Milodo Medical",
  },
  description:
    "Personalvermittlung im Rettungsdienst (Börse) in NRW · Erste-Hilfe-Ausbildung · Sanitätsdienst.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Milodo Medical Group",
    title: "Milodo Medical Group",
    description:
      "Personalvermittlung im Rettungsdienst (Börse) in NRW · Erste-Hilfe-Ausbildung · Sanitätsdienst.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Milodo Medical Group",
    description:
      "Personalvermittlung im Rettungsdienst (Börse) in NRW · Erste-Hilfe-Ausbildung · Sanitätsdienst.",
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
      <body className="min-h-dvh overflow-x-hidden">
        {recaptchaSiteKey ? <RecaptchaScript siteKey={recaptchaSiteKey} /> : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div id="top" />
        <SiteHeader variant="page" />
        {children}
        <SiteFooter contactEmail={contactEmail} />
        <CookieConsent />
      </body>
    </html>
  );
}
