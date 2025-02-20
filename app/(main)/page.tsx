import Image from "next/image";

export default function Home() {
  return (
    <main className="flex w-full">
      <div className="flex justify-center items-center bg-[url(/gif/LOLBG.gif)] h-dvh w-1/2">
        <h1>omE</h1>
      </div>
      <div className="flex justify-center items-center bg-[url(/gif/LOLBG.gif)] h-dvh w-1/2">
        <h1 className="text-white">omE</h1>
      </div>
    </main>
  );
}