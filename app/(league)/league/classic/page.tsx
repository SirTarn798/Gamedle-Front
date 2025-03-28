"use client";

import { useState } from "react";
import LeagueClassicItem from "@/app/components/LeagueClassicItem";
import { championsData } from "@/lib/exampleData";

interface Champion {
  id: number;
  name: string;
  title: string;
  release_date: string;
  class: string;
  range_type: string;
  resource_type: string;
  gender: string;
  region: string;
  created_at: string;
  updated_at: string;
  icon_url: string;
  roles: string[];
}

interface GuessResponse {
  result: {
    name: { value: string; correct: boolean };
    title: { value: string; correct: boolean };
    release_date: { value: string; correct: boolean; hint?: string };
    class: { value: string; correct: boolean };
  };
}

function LeagueClassic() {
  const [state, setState] = useState<Champion[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [guessResult, setGuessResult] = useState<GuessResponse | null>(null);

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const champName = formData.get('champName') as string;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/champions/guess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'player_id': 21,
          'name': champName
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setGuessResult(result);
    } catch (error) {
      console.error('Error:', error);
      setGuessResult(null);
    } finally {
      setLoading(false);
    }
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
          placeholder="Enter champion name"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <img src="/arrowheads.png" alt="Submit" width={65} />
        </button>
      </form>

      {loading && <div className="text-white">Loading...</div>}

      {guessResult && (
        <div className="w-full text-white space-y-4">
          <h2 className="text-2xl text-center">Guess Result</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-xl p-2 border-b-2 text-center">
              <p>Name: {guessResult.result.name.value}</p>
              <p>Correct: {guessResult.result.name.correct ? 'Yes' : 'No'}</p>
            </div>
            <div className="text-xl p-2 border-b-2 text-center">
              <p>Class: {guessResult.result.class.value}</p>
              <p>Correct: {guessResult.result.class.correct ? 'Yes' : 'No'}</p>
            </div>
            <div className="text-xl p-2 border-b-2 text-center">
              <p>Release Date: {guessResult.result.release_date.value}</p>
              <p>Correct: {guessResult.result.release_date.correct ? 'Yes' : 'No'}</p>
              {guessResult.result.release_date.hint && (
                <p>Hint: {guessResult.result.release_date.hint}</p>
              )}
            </div>
            <div className="text-xl p-2 border-b-2 text-center">
              <p>Gender: {guessResult.result.gender.value}</p>
              <p>Correct: {guessResult.result.gender.correct ? 'Yes' : 'No'}</p>
            </div>
            <div className="text-xl p-2 border-b-2 text-center">
              <p>Roles: {guessResult.result.roles.value}</p>
              <p>Correct: {guessResult.result.roles.correct ? 'Yes' : 'No'}</p>
            </div>
            <div className="text-xl p-2 border-b-2 text-center">
              <p>Range_Type: {guessResult.result.range_type.value}</p>
              <p>Correct: {guessResult.result.range_type.correct ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      )}

      {/* <div className="w-full grid grid-cols-6 gap-4 text-white cursor-default">
        <div className="text-xl p-2 border-b-2 text-center">Champion</div>
        <div className="text-xl p-2 border-b-2 text-center">Role</div>
        <div className="text-xl p-2 border-b-2 text-center">Type</div>
        <div className="text-xl p-2 border-b-2 text-center">Range</div>
        <div className="text-xl p-2 border-b-2 text-center">Resource</div>
        <div className="text-xl p-2 border-b-2 text-center">Gender</div>
      </div> */}

      {/* If no data yet, show the default champions data */}
      {/* {!state && championsData.map((champion, index) => (
        <LeagueClassicItem key={index} {...champion} />
      ))} */}
    </div>
  );
}

export default LeagueClassic;