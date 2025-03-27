"use client";

import { useState } from "react";
import LeagueClassicItem from "@/app/components/LeagueClassicItem";
import { championsData } from "@/lib/exampleData";
import { guessChampionClassic } from "../action";

function LeagueClassic() {
  const [state, setState] = useState<any>(undefined);  // store the data received from server
  const [loading, setLoading] = useState<boolean>(false);

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent default form submission
    setLoading(true); // set loading state to true while fetching data

    const formData = new FormData(e.target as HTMLFormElement);
    const result = await guessChampionClassic(state, formData);  // call the action
    console.log(result);
    setState(result);  // set the data returned from the action
    setLoading(false);  // reset loading state
  };

  return (
    <div className="flex flex-col items-center gap-8 mt-12 mb-24 w-full max-w-5xl">
      <h1 className="text-white text-5xl tracking-wider pixelBorder bg-mainTheme cursor-default">
        Guess The Champion
      </h1>
      <form onSubmit={handleFormSubmit} className="w-full relative mb-8">
        <input
          type="text"
          className="w-full p-3 bg-mainTheme border-4 border-white text-2xl text-white"
          name="champName"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <img src="/arrowheads.png" alt="Submit" width={65} />
        </button>
      </form>

      {loading && <div>Loading...</div>}

      <div className="w-full grid grid-cols-6 gap-4 text-white cursor-default">
        <div className="text-xl p-2 border-b-2 text-center">Champion</div>
        <div className="text-xl p-2 border-b-2 text-center">Role</div>
        <div className="text-xl p-2 border-b-2 text-center">Type</div>
        <div className="text-xl p-2 border-b-2 text-center">Range</div>
        <div className="text-xl p-2 border-b-2 text-center">Resource</div>
        <div className="text-xl p-2 border-b-2 text-center">Gender</div>
      </div>

      {state && state.map((champion: any, index: number) => (
        <LeagueClassicItem key={index} {...champion} />
      ))}

      {/* If no data yet, show the default champions data */}
      {!state && championsData.map((champion, index) => (
        <LeagueClassicItem key={index} {...champion} />
      ))}
    </div>
  );
}

export default LeagueClassic;
