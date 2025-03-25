'use client';
import router from 'next/router';
import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Champion {
  id: number;
  name: string;
  title: string;
  release_date: string;
  class: string;
  range_type: string;
  resource_type: string;
  gender: string;
  icon_path: string;
  created_at: string;
  updated_at: string;
}

export default function ChampionDetails({ params }: { params: { championId: string } }) {
  const [champion, setChampion] = useState<Champion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const championId = React.use(params).championId;

  useEffect(() => {
    const fetchChampion = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost/api/champions/${championId}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch champion');
        }

        const result = await response.json();
        setChampion(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchChampion();
  }, [React.use(params).championId]);

  if (loading) {
    return <div>Loading champion details...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">Error: {error}</div>;
  }

  if (!champion) {
    return <div>Champion not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-2xl leading-6 font-medium text-gray-900">Champion Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about the champion.</p>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            {champion.icon_path && (
              <div className="mr-4 relative w-16 h-16 rounded-full overflow-hidden">
                <Image src={champion.icon_path} alt={champion.name} layout="fill" objectFit="cover" />
              </div>
            )}
            <h2 className="text-3xl text-gray-900">{champion.name}</h2>
            <p className="ml-4 text-xl text-gray-500">"{champion.title}"</p>
          </div>

          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Champion ID</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{champion.id}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Class</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{champion.class}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Range Type</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{champion.range_type}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Resource Type</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{champion.resource_type}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Gender</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{champion.gender}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Region</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{champion.gender}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Release Date</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{new Date(champion.release_date).toLocaleDateString()}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Created at</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{new Date(champion.created_at).toLocaleString()}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Last updated</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{new Date(champion.updated_at).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}