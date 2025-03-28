"use client"

import ChampionInfo from "@/app/components/ChampionInfo";
import { champion } from "@/lib/type";
import { useParams } from "next/navigation";
import { getChampById } from "./action";
import { useEffect, useState } from "react";

export default function EditChampion() {
  const [champion, setChampion] = useState<champion>();
  const { championId } = useParams();
  // console.log(championId)
  useEffect(() => {
    const fetchChampionData = async () => { // Renamed 'fetch' to be more descriptive
      // const { championId } = useParams();
      console.log("champion Id: ", championId);
      const data = await getChampById(championId);
      console.log(data);
      setChampion(data.data);
    };

    fetchChampionData(); // Call the async function immediately

  }, []);

  // console.log(champion)
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-normal mb-6">Edit Champion</h1>
      <ChampionInfo champ={champion} />
    </div>
  );
}