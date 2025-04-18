'use client';
import router from 'next/router';
import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Pokemon {
  id: number;
  name: string;
  title: string;
  release_date: string;
  class: string;
  range_type: string;
  resource_type: string;
  gender: string;
  region: string;
  icon_url: string;
  created_at: string;
  updated_at: string;
  roles: role;
}
interface role {
  id: number;
  role_name: string;
  created_at: string;
  updated_at: string;
}

export default function PokemonDetails({ params }: { params: { pokemonId: string } }) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const pokemonId = React.use(params).pokemonId;

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/pokemons/${pokemonId}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch pokemon');
        }

        const result = await response.json();
        setPokemon(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [React.use(params).pokemonId]);

  if (loading) {
    return <div>Loading pokemon details...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">Error: {error}</div>;
  }

  if (!pokemon) {
    return <div>Pokemon not found.</div>;
  }

  const handleDelete = (id) => {
    const response = fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/pokemons/${pokemonId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    })
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-2xl leading-6 font-medium text-gray-900">Pokemon Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about the pokemon.</p>
          </div>
          <div className='flex gap-5'>
            <Link href="/admin/pokemons">
              <button
                className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline active:bg-red-800"
                onClick={() => handleDelete(pokemon.id)}
              >
                Delete
              </button>
            </Link>
            <Link href="">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline active:bg-blue-800"
                onClick={()=>{return}}
              >
                Edit
              </button>
            </Link>
            <Link href="/admin/pokemons">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded focus:outline-none focus:shadow-outline active:bg-gray-500"
              >
                Back
              </button>
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            {pokemon.icon_url && (
              <img
                className="h-20 w-20 rounded-full object-cover mr-10"
                src={pokemon.icon_url}
                alt={`${pokemon.name} Icon`}
              />
            )}
            <h2 className="text-3xl text-gray-900">{pokemon.name}</h2>
            <p className="ml-4 text-xl text-gray-500">"{pokemon.title}"</p>
          </div>

          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Pokemon ID</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{pokemon.id}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{pokemon.name}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Type1</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{pokemon.type1}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Type2</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{pokemon.type2}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Ability </dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">
                {pokemon.abilities && pokemon.abilities.map((ability, index) => (
                  
                  <span key={index} className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">• {ability}<br></br></span>
                ))}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Height</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{pokemon.height}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Weight</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{pokemon.weight}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Attack</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{pokemon.attack}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Defence</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{pokemon.defence}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Speed</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{pokemon.speed}</dd>
            </div>
            {/* <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Release Date</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{new Date(pokemon.release_date).toLocaleDateString()}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Created at</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{new Date(pokemon.created_at).toLocaleString()}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Last updated</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{new Date(pokemon.updated_at).toLocaleString()}</dd>
            </div> */}
          </dl>
        </div>
      </div>
    </div>
  );
}