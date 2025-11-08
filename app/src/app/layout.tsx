import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Cover the World | Vertical Reels Generator",
  description: "Procedurally generate a looping vertical animation and capture it as a WebM for Instagram Reels.",
  openGraph: {
    title: "AI Cover the World",
    description: "Generate an AI-styled looping animation optimized for Instagram Reels.",
    siteName: "AI Cover the World",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Cover the World",
    description: "Generate a looping AI video for Instagram."
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
