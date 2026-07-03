import type { Metadata } from "next";
import {
  IBM_Plex_Serif,
  IBM_Plex_Mono,
  Figtree,
  Roboto_Mono,
  Loved_by_the_King,
  Libre_Baskerville,
} from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const ibmSerif = IBM_Plex_Serif({
  variable: "--font-ibm-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const lovedByTheKing = Loved_by_the_King({
  variable: "--font-loved",
  subsets: ["latin"],
  weight: ["400"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Kyle Burgess — Portfolio",
  description:
    "Creative direction for high-stakes moments. Executive communication design, motion, and brand systems at Microsoft AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmSerif.variable} ${ibmMono.variable} ${figtree.variable} ${robotoMono.variable} ${lovedByTheKing.variable} ${libreBaskerville.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
