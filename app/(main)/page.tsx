import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex w-full text-white">
      <div className="flex justify-center items-center bg-[url(/LeagueMain.png)] hover:bg-[url(/gif/LeagueMain.gif)] bg-cover h-dvh w-1/2 relative group transition-all duration-300">
        {/* Dark overlay that appears on hover */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
        <Link href="/league" className="text-2xl text-shadow-nm relative transform transition-all duration-300 group-hover:scale-125 z-10">
          League of Legends
        </Link>
      </div>
      <div className="flex justify-center items-center bg-[url(/PokemonMain.png)] hover:bg-[url(/gif/PokemonMain.gif)] bg-cover h-dvh w-1/2 relative group transition-all duration-300">
        {/* Dark overlay that appears on hover */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
        <Link href="/pokemon" className="text-2xl text-shadow-nm relative transform transition-all duration-300 group-hover:scale-125 z-10 ">
          Pokemon
        </Link>
      </div>
    </main>
  );
}