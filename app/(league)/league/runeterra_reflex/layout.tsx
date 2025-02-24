import type { Metadata } from "next";
import { Jersey_10 } from "next/font/google";
import "../../../globals.css";
import NavBarLogin from "@/app/components/NavBarLogin";

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
      <div
        className={`${jersey.className} overflow-x-hidden bg-mainTheme`}
      >
        <div className="w-full flex flex-col items-center">{children}</div>
      </div>
  );
}
