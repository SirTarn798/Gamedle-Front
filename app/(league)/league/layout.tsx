import type { Metadata } from "next";
import { Jersey_10 } from "next/font/google";
import "../../globals.css";
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
    <html lang="en">
      <body className={`${jersey.className} overflow-x-hidden bg-mainTheme`}>
        <div className="relative flex flex-col items-center w-full h-dvh justify-between bg-[url(/ArcadeBG.jpg)] bg-cover bg-center">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 w-full flex flex-col items-center">

          <NavBarLogin/>
          {children}
          </div>
        </div>
      </body>
    </html>
  );
}
