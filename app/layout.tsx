import type { Metadata } from "next";
import {
  IBM_Plex_Serif,
  IBM_Plex_Mono,
  Figtree,
  Roboto_Mono,
  Loved_by_the_King,
  Libre_Baskerville,
  DM_Serif_Text,
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

// BidBud brand wordmark
const dmSerifText = DM_Serif_Text({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const title = "Kyle Burgess — Portfolio";
const description =
  "Creative direction for high-stakes moments. Executive communication design, motion, and brand systems at Microsoft AI.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  // og:image / twitter:image are supplied by app/opengraph-image.png +
  // app/twitter-image.png (file-convention). These fill in the title/description
  // that show alongside the header image in link previews.
  openGraph: {
    title,
    description,
    siteName: "Kyle Burgess",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmSerif.variable} ${ibmMono.variable} ${figtree.variable} ${robotoMono.variable} ${lovedByTheKing.variable} ${libreBaskerville.variable} ${dmSerifText.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
