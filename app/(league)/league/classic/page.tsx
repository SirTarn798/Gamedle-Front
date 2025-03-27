"use client";

import LeagueClassicItem from "@/app/components/LeagueClassicItem";
import { championsData } from "@/lib/exampleData";
import { useActionState } from "react";
import { guessChampionClassic } from "../action";
import { useState, useEffect, useRef } from "react";

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

interface AutocompleteItem {
  value: string;
  label: string;
  image: string;
}

function LeagueClassic() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const [state, guessChamp] = useActionState(guessChampionClassic, undefined);
  const [champions, setChampions] = useState<Champion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    // Transform and filter fetched champions for autocomplete
    const autocompleteSuggestions = champions
      .filter((champ) =>
        champ.name.toLowerCase().includes(value.toLowerCase())
      )
      .map((champ) => ({
        value: champ.name,
        label: champ.name,
        image: champ.icon_url,
      }));

    setSuggestions(autocompleteSuggestions);
  };

  const handleSelect = (item: AutocompleteItem) => {
    setInputValue(item.value);
    setSuggestions([]);
    setIsInputFocused(false);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(document.activeElement)
      ) {
        setIsInputFocused(false);
        setSuggestions([]);
      }
    }, 100);
  };

  useEffect(() => {
    async function fetchChampions() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/champions`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch champions');
        }

        const data = await response.json();
        setChampions(data.data); // Assuming your API response has a 'data' array
        setIsLoading(false);
      } catch (err) {
        setError('Unable to load champions');
        setIsLoading(false);
        console.error(err);
      }
    }

    fetchChampions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-2xl">
        Loading champions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-2xl">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 mt-12 mb-24 w-full max-w-5xl">
      <h1 className="text-white text-5xl tracking-wider pixelBorder bg-mainTheme cursor-default">
        Guess The Champion
      </h1>
      <form action={guessChamp} className="w-full relative mb-8" autoComplete="off">
        <input
          ref={inputRef}
          type="text"
          className="w-full p-3 bg-mainTheme border-4 border-white text-2xl text-white"
          name="champName"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <div ref={autocompleteRef} className={`absolute bg-mainTheme border-4 border-white w-full z-[10] ${!isInputFocused ? 'hidden' : ''}`}>
          {suggestions.length > 0 && (
            <ul className="autocomplete-list">
              {suggestions.map((item) => (
                <li
                  key={item.value}
                  onClick={() => handleSelect(item)}
                  className="autocomplete-item flex items-center gap-2 cursor-pointer p-2 hover:bg-white/10"
                >
                  <img src={item.image} alt={item.label} className="autocomplete-image h-8 w-8 rounded-full" />
                  <span className="text-white">{item.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <img src="/arrowheads.png" alt="Submit" width={65} />
        </button>
      </form>

      <div className="w-full grid grid-cols-6 gap-4 text-white cursor-default">
        <div className="text-xl p-2 border-b-2 text-center">Champion</div>
        <div className="text-xl p-2 border-b-2 text-center">Role</div>
        <div className="text-xl p-2 border-b-2 text-center">Type</div>
        <div className="text-xl p-2 border-b-2 text-center">Range</div>
        <div className="text-xl p-2 border-b-2 text-center">Resource</div>
        <div className="text-xl p-2 border-b-2 text-center">Gender</div>
      </div>

      {/* {championsData.map((champion) => (
        <LeagueClassicItem key={champion.id} {...champion} />
      ))} */}
    </div>
  );
}

export default LeagueClassic;