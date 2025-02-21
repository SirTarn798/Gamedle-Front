"use client";

import LeagueClassicItem from "@/app/components/LeagueClassicItem";
import { championsData } from "@/lib/exampleData";

function LeagueClassic() {
  return (
    <div className="flex flex-col items-center gap-8 mt-12 w-full max-w-5xl">
      <h1 className="text-white text-5xl tracking-wider pixelBorder bg-mainTheme">
        Guess The Champion
      </h1>
      
      <form action="" className="w-full relative mb-8">
        <input
          type="text"
          className="w-full p-3 bg-mainTheme border-4 border-white text-lg"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <img src="/arrowheads.png" alt="Submit" width={65} />
        </button>
      </form>

      <div className="w-full grid grid-cols-6 gap-4">
        <div className="text-xl p-2 border-b-2 text-center">Image</div>
        <div className="text-xl p-2 border-b-2 text-center">Role</div>
        <div className="text-xl p-2 border-b-2 text-center">Type</div>
        <div className="text-xl p-2 border-b-2 text-center">Range</div>
        <div className="text-xl p-2 border-b-2 text-center">Resource</div>
        <div className="text-xl p-2 border-b-2 text-center">Gender</div>
      </div>

      {championsData.map((champion, index) => (
        <LeagueClassicItem key={index} {...champion} />
      ))}
    </div>
  );
}

export default LeagueClassic;