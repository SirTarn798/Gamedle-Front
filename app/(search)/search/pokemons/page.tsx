"use client"

import { useState, useEffect } from "react";
import ShowChampions from "@/app/components/ShowChampions";
import { searchChampionData } from "@/lib/exampleData";
import ShowPokemons from "@/app/components/ShowPokemons";

function SearchPokemon() {
    const [searchTerm, setSearchTerm] = useState("");
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChampions = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/pokemons/bulk`); // Adjust this endpoint to your API
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch pokemons: ${response.status}`);
                }
                const data = await response.json();
                setPokemons(data.data);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching pokemons:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchChampions();
    }, []);

    // Filter pokemons based on input
    const filteredPokemons = pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col items-center gap-8 mt-12 w-full h-full max-w-5xl text-white">
            <h1 className="text-white text-5xl tracking-wider pixelBorder bg-mainTheme">
                Search Pokemons
            </h1>

            <form action="" className="w-full relative mb-8" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    className="w-full p-3 bg-mainTheme border-4 border-white text-lg"
                    placeholder="Search for a pokemon..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                    <img src="/arrowheads.png" alt="Submit" width={65} />
                </button>
            </form>
            <div className="pixelBorder bg-mainTheme w-full min-h-[200px] max-h-[400px] overflow-auto overflow-x-hidden p-2 custom-scrollbar">
                {filteredPokemons.map((pokemon, index) => (
                    <ShowPokemons key={index} {...pokemon} />
                ))}
            </div>
        </div>
    );
}

export default SearchPokemon;
