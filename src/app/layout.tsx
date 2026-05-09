import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Milodo Medical Group",
    template: "%s · Milodo Medical",
  },
  description:
    "Personalvermittlung im Rettungsdienst (Börse) in Dortmund · Erste-Hilfe-Ausbildung · Sanitätsdienst.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
