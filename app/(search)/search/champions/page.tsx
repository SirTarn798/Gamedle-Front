"use client"

import { useState, useEffect } from "react";
import ShowChampions from "@/app/components/ShowChampions";
import { searchChampionData } from "@/lib/exampleData";
import React from "react";

function SearchChampion() {
    const [searchTerm, setSearchTerm] = useState("");
    const [champions, setChampions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [options, setOptions] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
    const inputRef = React.useRef(null); // Create a ref for the input

    useEffect(() => {
        const fetchChampions = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/champions/bulk`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch champions: ${response.status}`);
                }
                const data = await response.json();
                setChampions(data.data);
                const championNames = data.data.map(champion => champion.name);
                setOptions(championNames);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching champions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchChampions();
    }, []);

    const handleInputChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);

        if (newSearchTerm) {
            const filteredSuggestions = options.filter(name =>
                name.toLowerCase().includes(newSearchTerm.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
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

    // console.log(champions[0])
    // console.log(options)
    // Filter champions based on input
    const filteredChampions = champions.filter(champion =>
        champion.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col items-center gap-8 mt-12 w-full h-full max-w-5xl text-white">
            <h1 className="text-white text-5xl tracking-wider pixelBorder bg-mainTheme">
                Search Champions
            </h1>

            <div className="w-full relative mb-8">
                <input
                    ref={inputRef}
                    type="text"
                    className="w-full p-3 bg-mainTheme border-4 border-white text-lg"
                    placeholder="Search for a champion..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => searchTerm && suggestions.length > 0 && setIsSuggestionVisible(true)}
                />
                {/* {isSuggestionVisible && (
                    <div
                        className="absolute top-full left-0 bg-mainTheme border border-white rounded-md shadow-md overflow-hidden z-10"
                        style={{ width: inputWidth }}
                    >
                        {suggestions.length > 0 ? (
                            suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="p-2 cursor-pointer hover:bg-white hover:text-mainTheme"
                                >
                                    {suggestion}
                                </div>
                            ))
                        ) : (
                            <div className="p-2 text-gray-400">No suggestions</div>
                        )}
                    </div>
                )} */}
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                    <img src="/arrowheads.png" alt="Submit" width={65} />
                </button>
            </div>
            <div className="pixelBorder bg-mainTheme w-full min-h-[200px] max-h-[400px] overflow-auto overflow-x-hidden p-2 custom-scrollbar">
                {filteredChampions.map((champion, index) => (
                    <ShowChampions key={index} {...champion} />
                ))}
            </div>
        </div>
    );
}

export default SearchChampion;