import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The League",
  description: "The greatest basketball tournament in existence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script strategy="beforeInteractive" src="/sql-wasm.js" />
      </head>
      <body className={inter.className}>
        
        {children}
      </body>
    </html>
  );
}
