"use client";

import { useState } from "react";

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

interface GuessResult {
  data: {
    name: { value: string; correct: boolean };
    title: { value: string; correct: boolean };
    gender: { value: string; correct: boolean };
    class: { value: string; correct: boolean }
    roles: { value: string[]; correct: boolean; roles_match: { match: "none" | "partial" | "exact", matching_roles: string[] } }
    resource_type: { value: string; correct: boolean };
    range_type: { value: string; correct: boolean };
    region: { value: string; correct: boolean };
    release_date: { value: string; correct: boolean; hint?: string };
  },
  type: "progress" | "result";
}

export function LeagueClassicPanel({ userId }: { userId: string }) {
  const [guessHistory, setGuessHistory] = useState<GuessResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const champName = formData.get('champName') as string;
    const body = {
      'user_id': userId.toString(),
      'name': champName
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/champions/guess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      const extractedData: GuessResult = [
        ...Object.values(result.progress)
          .map(entry => ({
            type: "progress",
            data: entry.pivot.details.result
          }))
      ].reverse();

      setGuessHistory(extractedData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }
  };

  const renderCell = (value: string, correct: boolean) => (
    <div
      className={`p-2 text-center ${correct ? 'bg-green-600' : 'bg-red-600'
        }`}
    >
      {value}
    </div>
  );

  const renderCellForRoles = (value: string, roles_match: { match: "none" | "partial" | "exact", matching_roles: string[] }) => {
    return (
      <div
        className={`p-2 text-center ${roles_match.match === "exact" ? 'bg-green-600' : roles_match.match === "partial" ? 'bg-yellow-600' : 'bg-red-600'
          }`}
      >
        {value}
      </div>
    )
  }

  const renderCellYear = (value: string, correct: boolean, hint: "Too Early" | "Too Late") => {
    return (
      <div
        className={`p-2 text-center ${correct ? 'bg-green-600' : 'bg-red-600'
          }`}
      >
        {value} ({hint})
      </div>
    )
  }

  return (
    <>

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

      {guessHistory.length > 0 && (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-white border-collapse">
            <thead>
              <tr>
                <th className="p-2 border bg-mainTheme">Champion</th>
                <th className="p-2 border bg-mainTheme">Gender</th>
                <th className="p-2 border bg-mainTheme">Class</th>
                <th className="p-2 border bg-mainTheme">Positions</th>
                <th className="p-2 border bg-mainTheme">Resource</th>
                <th className="p-2 border bg-mainTheme">Range</th>
                <th className="p-2 border bg-mainTheme">Region</th>
                <th className="p-2 border bg-mainTheme">Release Year</th>
              </tr>
            </thead>
            <tbody>
              {guessHistory?.map((guess, index) => (
                <tr key={index}>
                  <td className="border">
                    {renderCell(guess.data.name.value, guess.data.name.correct)}
                  </td>
                  <td className="border">
                    {renderCell(guess.data.gender.value, guess.data.gender.correct)}
                  </td>
                  <td className="border">
                    {renderCell(guess.data.class.value, guess.data.class.correct)}
                  </td>
                  <td className="border">
                    {renderCellForRoles(guess.data.roles.value.toString(), guess.data.roles.roles_match)}
                  </td>
                  <td className="border">
                    {renderCell(guess.data.resource_type.value, guess.data.resource_type.correct)}
                  </td>
                  <td className="border">
                    {renderCell(guess.data.range_type.value, guess.data.range_type.correct)}
                  </td>
                  <td className="border">
                    {renderCell(guess.data.region.value, guess.data.region.correct)}
                  </td>
                  <td className="border">
                    {renderCellYear(guess.data.release_date.value, guess.data.release_date.correct, guess.data.release_date.hint)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

