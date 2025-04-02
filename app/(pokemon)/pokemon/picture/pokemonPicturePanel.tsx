"use client";

import { useActionState, useEffect, useState } from "react";
import { guessPokemonClassic } from "../action";
import React from "react";

type Props = {
    userId: string,
}

export default function PokemonPicturePanel({ userId }: Props) {

    const [zoomLevel, setZoomLevel] = useState(24);
    const [loading, setLoading] = useState(false);
    const [picture, setPicture] = useState<string>("");
    const [ansResult, setAnsResult] = useState<"neutral" | "false" | "correct">("neutral");
    const [isVibrating, setIsVibrating] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);
    const [options, setOptions] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
    const inputRef = React.useRef(null);
        
    useEffect(() => {
        const getImage = async () => {
            const body = { user_id: userId }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/players/get_pokemon_image`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            setPicture(data.data.location)
        }
        getImage()
    }, [userId])

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(1, prev - 2));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const pokemonName = formData.get('pokemonName') as string;
        const body = {
            'user_id': userId.toString(),
            'name': pokemonName
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/pokemon_images/guess`, {
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
            console.log(result)
            setAnsResult(result.success ? "correct" : "false");
            if (!result.success) {
                setIsVibrating(true);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
            (e.target as HTMLFormElement).reset();

            // Stop vibration effect after a short delay
            setTimeout(() => {
                setIsVibrating(false);
            }, 500);
        }
    };
  //  handle options

  useEffect(() => {
      const fetchPokemons = async () => {
          try {
              setLoading(true);
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/pokemons/get_all`);

              if (!response.ok) {
                  throw new Error(`Failed to fetch pokemons: ${response.status}`);
              }
              const data = await response.json();
              const pokemonNames = data.map(pokemon => pokemon.name);
              setOptions(pokemonNames);
              setError(null);
          } catch (err) {
              setError(err.message);
              console.error("Error fetching pokemons:", err);
          } finally {
              setLoading(false);
          }
      };
      fetchPokemons();
  }, []);
    const handleInputChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);

        if (newSearchTerm) {
            const filteredSuggestions = options.filter(name =>
                name.toLowerCase().startsWith(newSearchTerm.toLowerCase())
            );
            setSuggestions(filteredSuggestions.sort());
            setIsSuggestionVisible(true);
        } else {
            setSuggestions([]);
            setIsSuggestionVisible(false);
        }
    };

    // Close suggestions when clicking outside the input/suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target) && isSuggestionVisible) {
                setIsSuggestionVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [inputRef, isSuggestionVisible]);

  const inputWidth = inputRef.current?.offsetWidth || '100%'; // Get input width

    return (
        <div className="flex flex-col items-center gap-8 mt-12 w-full max-w-5xl">
            <h1 className="gameBorder1 text-5xl text-zinc-500 tracking-wider cursor-default text:center">
                Who's that Pokémon?
            </h1>
            <form onSubmit={handleFormSubmit} className="relative mb-8">
                <div className=" gameBorder2 flex flex-row flex-nowrap gap-[30px] px-[30px] py-[15px]">
                    <input
                        type="text"
                        className="w-75% focus:outline-none focus:ring-0 border-none bg-transparent text-2xl text-white"
                        name="pokemonName"
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={() => searchTerm && suggestions.length > 0 && setIsSuggestionVisible(true)}
                        autoComplete="off"
                    />
                        {isSuggestionVisible && (
                            <div
                                className="absolute top-[80px] left-0 bg-mainTheme border border-white rounded-md shadow-md overflow-y-auto z-10 max-h-[200px]"
                                style={{ width: inputWidth }}
                            >
                                {suggestions.length > 0 ? (
                                    suggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className="p-2 cursor-pointer hover:bg-white hover:text-mainTheme text-white"
                                        >
                                            {suggestion}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-2 text-gray-400">No suggestions</div>
                                )}
                            </div>
                        )}
                    <button
                        type="submit"
                        className=""
                    >
                        <img className="animate" src="/enter.png" alt="Submit" width={65} />
                    </button>
                </div>
            </form>

            <div className="flex flex-col items-center gap-4 p-10 py-16 relative">
                <div
                    className={`w-124 h-96 overflow-hidden border-4 ${isVibrating ? 'animate-shake' : ''}`}
                    style={{
                        animation: isVibrating ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'none'
                    }}
                >
                    <img
                        src={picture || "/Logo.png"}
                        alt="Zoomable image"
                        className="w-full h-full object-cover transition-transform duration-500"
                        style={{
                            transform: `scale(${zoomLevel})`,
                        }}
                    />
                </div>

                {ansResult === "false" && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8">
                        <div className="text-red-500 text-6xl font-bold">X</div>
                    </div>
                )}

                {ansResult === "correct" && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8">
                        <div className="text-green-500 text-4xl font-bold">Correct!</div>
                    </div>
                )}

                <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg
                   hover:bg-blue-600 transition-colors
                   disabled:bg-gray-400 disabled:cursor-not-allowed mt-12"
                >
                    Zoom Out
                </button>

                <div className="text-sm text-white">
                    Current zoom: {zoomLevel.toFixed(1)}x
                </div>
            </div>

        </div>
    );
}