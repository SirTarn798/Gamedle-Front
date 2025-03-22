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
      <body
        className={`${jersey.className} overflow-x-hidden bg-mainTheme bg-[url(/ArcadeBG.png)] bg-cover bg-center bg-fixed`}
      >
        <NavBarLogin />
        <div className="w-full flex flex-col items-center">{children}</div>
      </body>
    </html>
  );
}
