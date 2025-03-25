import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import { Jersey_10 } from "next/font/google";
import "../../../globals.css";
import NavBarLogin from "@/app/components/NavBarLogin";

const jersey = Jersey_10({ subsets: ["latin"], weight: "400" });
const pixelify = Pixelify_Sans({ subsets: ["latin"]});

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
        className={`${jersey.className} overflow-x-hidden bg-mainTheme bg-[url(/PokemonBG5.jpg)] bg-cover bg-fixed `}
      >
        <NavBarLogin />
        <div className={`${pixelify.className} w-full flex flex-col items-center`}>{children}</div>
      </body>
    </html>
  );
}
