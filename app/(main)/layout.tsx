import type { Metadata } from "next";
import { Jersey_10 } from "next/font/google";
import "../globals.css";
import NavBarLogin from "../components/NavBarLogin";

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
      <body className={`${jersey.className} overflow-x-hidden`}>
        <NavBarLogin />
        {children}
      </body>
    </html>
  );
}
