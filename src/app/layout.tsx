import type { Metadata } from "next";

import "./globals.css";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";

export const metadata: Metadata = {
  title: {
    default: "Milodo Medical Group",
    template: "%s · Milodo Medical",
  },
  description:
    "Personalvermittlung im Rettungsdienst (Börse) in Dortmund · Erste-Hilfe-Ausbildung · Sanitätsdienst.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  icons: {
    icon: [{ url: "/logo/Logo.png", type: "image/png" }],
    apple: [{ url: "/logo/Logo.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "kontakt@milodo-medical.de";
  return (
    <html lang="de">
      <body>
        <div id="top" />
        <SiteHeader variant="page" />
        {children}
        <SiteFooter contactEmail={contactEmail} />
      </body>
    </html>
  );
}
