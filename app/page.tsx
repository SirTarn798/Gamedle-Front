import Image from "next/image";

export default function Home() {
  console.log("ome");
  return (
    <div className="flex w-dvw">
      <div className="flex justify-center items-center bg-[url(/LOLBG.gif)] h-dvh w-full">
        <h1 className="">omE</h1>
      </div>
      <div className="flex justify-center items-center bg-[url(/LOLBG.gif)] h-dvh w-full">
        <h1 className="text-white">omE</h1>
      </div>
    </div>
  );
}
