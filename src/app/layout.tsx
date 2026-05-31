import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Haraca — Wear It Simply",
    template: "%s | Haraca",
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
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
