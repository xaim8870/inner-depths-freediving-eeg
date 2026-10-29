import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./ui.css";

const sans = localFont({
  src: "../fonts/manrope-latin.woff2",
  weight: "200 800",
  variable: "--font-sans",
  display: "swap",
});

const display = localFont({
  src: [
    { path: "../fonts/fraunces-latin.woff2", weight: "300 600", style: "normal" },
    { path: "../fonts/fraunces-italic-latin.woff2", weight: "300 600", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inner Depths",
  description: "Freediving training and performance platform",
};

export const viewport: Viewport = {
  themeColor: "#0B2A38",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable}`}>
        {children}
      </body>
    </html>
  );
}
