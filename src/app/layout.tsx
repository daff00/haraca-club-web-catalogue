import type { Metadata } from "next";
// Google Fonts will be loaded via CSS fallback due to build environment constraints
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Haraca — Wear It Simply",
    template: "Haraca | %s",
  },
  icons: {
    icon: "/haraca_logo.svg",
  },
  description:
    "Everyday essentials, thoughtfully made. Shop tanktops, oversized tees, and casual wear from Haraca.",
  keywords: ["haraca", "fashion", "casual wear", "tanktop", "oversize", "kaos"],
  openGraph: {
    title: "Haraca — Wear It Simply",
    description: "Everyday essentials, thoughtfully made.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
