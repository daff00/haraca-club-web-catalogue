import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond, Geist, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const inter = Inter({subsets:['latin'],variable:'--font-inter'});

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
    <html lang="en" className={cn(dmSans.variable, cormorant.variable, "font-sans", geist.variable)}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
