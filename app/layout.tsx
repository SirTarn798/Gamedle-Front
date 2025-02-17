import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Jersey_10 } from "next/font/google";

const jersey = Jersey_10({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "GAMEDLE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jersey.className}>{children}</body>
    </html>
  );
}
