"use server"

import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { ChampionGuessResult } from "@/lib/type";

export async function guessChampionClassic(prevState: ChampionGuessResult | undefined, formData: FormData): Promise<ChampionGuessResult | undefined> {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const link = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/champions/guess`;
  const name = formData.get("champName");

  try {
    const response = await fetch(link, {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify({ "player_id": 1, "name": name })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export async function guessChampionPicture(prevState: any, formData: FormData) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const link = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/champion_images/guess`;
  const name = formData.get("champName");
  try {
    const response = await fetch(link, {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify({ "player_id": session?.user.id, "name": name })
    });
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}