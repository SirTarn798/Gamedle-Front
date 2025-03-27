"use client";

import LeagueClassicItem from "@/app/components/LeagueClassicItem";
import PokemonClassicItem from "@/app/components/PokemonClassicItem";
import { championsData, pokemonData } from "@/lib/exampleData";

export default function PokemonClassic() {
  return (
    <div className="flex flex-col items-center gap-8 mt-12 mb-24 w-full max-w-5xl">
      <h1 className="gameBorder1 text-5xl tracking-wider cursor-default text:center">
        Who's that Pokémon?
      </h1>
      <form action="" className="relative mb-8">
        <div className=" gameBorder2 flex flex-row flex-nowrap gap-[30px] px-[30px] py-[15px]">
          <input
            type="text"
            className="w-75% focus:outline-none focus:ring-0 border-none bg-transparent text-2xl text-white"
          />
          <button
            type="submit"
            className=""
          >
            <img className="animate" src="/enter.png" alt="Submit" width={65} />
          </button>
        </div>
      </form>

      <div className="w-full grid grid-cols-7 gap-4 text-white font-bold text-shadow-xl cursor-default">
        <div className="text-xl p-2 border-b-2 text-center tooltip">Pokémon</div>
        <div className="text-xl p-2 border-b-2 text-center tooltip">Type1<span className="tooltiptext">Primary elemental attribute</span></div>
        <div className="text-xl p-2 border-b-2 text-center tooltip">Type2<span className="tooltiptext">Secondary elemental attribute</span></div>
        <div className="text-xl p-2 border-b-2 text-center tooltip">Generation</div>
        <div className="text-xl p-2 border-b-2 text-center tooltip">Attack</div>
        <div className="text-xl p-2 border-b-2 text-center tooltip">Speed</div>
        <div className="text-xl p-2 border-b-2 text-center tooltip">Defense</div>
      </div>

      {pokemonData.map((pokemon, index) => (
        <PokemonClassicItem key={index} {...pokemon} />
      ))}
    </div>
  );
}
