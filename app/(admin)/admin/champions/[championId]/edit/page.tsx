"use client";

import ChampionInfo from "@/app/components/ChampionInfo";
import { useParams } from "next/navigation";
import { getChampById, getPicsByChampId } from "./action";
import { useEffect, useState } from "react";
import { champion, ChampionWithPictures } from "@/lib/type";

export default function EditChampion() {
  const { championId } = useParams();
  const [champ, setChamp] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInfo = async () => {
      if (!championId) return;
      
      setLoading(true);
      const champInfo = await getChampById(championId);
      const champPics = await getPicsByChampId(championId);
      
      setChamp({
        ...champInfo.data, // Spread existing champion data
        pictures: champPics, // Add pictures array to champion object
      });
      setLoading(false);
    };
    
    getInfo();
  }, [championId]); // Remove champ from dependency array to prevent infinite loops

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Champion</h1>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : champ ? (
        <ChampionInfo champ={champ} />
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Could not load champion data.
        </div>
      )}
    </div>
  );
}
