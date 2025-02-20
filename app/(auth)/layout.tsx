import type { Metadata } from "next";
import { Jersey_10 } from "next/font/google";
import "../globals.css";

const jersey = Jersey_10({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "om",
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
          {children}
        </div>
      </body>
    </html>
  );
}
