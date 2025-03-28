"use client"

import { useState } from "react";
import ShowChampions from "@/app/components/ShowChampions";
import { searchChampionData } from "@/lib/exampleData";

function SearchChampion() {
    const [searchTerm, setSearchTerm] = useState("");

    // Filter champions based on input
    const filteredChampions = searchChampionData.filter(champion =>
        champion.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col items-center gap-8 mt-12 w-full h-full max-w-5xl">
            <h1 className="text-white text-5xl tracking-wider pixelBorder bg-mainTheme">
                Search Champions
            </h1>

            <form action="" className="w-full relative mb-8" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    className="w-full p-3 bg-mainTheme border-4 border-white text-lg"
                    placeholder="Search for a champion..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                    <img src="/arrowheads.png" alt="Submit" width={65} />
                </button>
            </form>
            <div className="pixelBorder bg-mainTheme w-full min-h-[200px] max-h-[400px] overflow-auto overflow-x-hidden p-2 custom-scrollbar">
                {filteredChampions.map((champion, index) => (
                    <ShowChampions key={index} {...champion} />
                ))}
            </div>

        </div>
    );
}

export default SearchChampion;
