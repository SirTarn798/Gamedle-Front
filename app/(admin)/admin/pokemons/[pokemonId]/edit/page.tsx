"use client";

import PokemonInfo from "@/app/components/PokemonInfo";
import { useParams } from "next/navigation";
import { getPokemonById, getPicsByPokemonId } from "./action";
import { useEffect, useState } from "react";

export default function EditPokemon() {
  const { pokemonId } = useParams();
  const [pokemon, setPokemon] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInfo = async () => {
      if (!pokemonId) return;
      
      setLoading(true);
      const pokemonInfo = await getPokemonById(pokemonId);
      const pokemonPics = await getPicsByPokemonId(pokemonId);
      
      setPokemon({
        ...pokemonInfo.data, // Spread existing pokemon data
        pictures: pokemonPics, // Add pictures array to pokemon object
      });
      setLoading(false);
    };
    
    getInfo();
  }, [pokemonId]); // Remove pokemon from dependency array to prevent infinite loops

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Pokemon</h1>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : pokemon ? (
        <PokemonInfo pokemon={pokemon} />
        // <div>hello</div>
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Could not load Pokemon data.
        </div>
      )}
    </div>
  );
}
