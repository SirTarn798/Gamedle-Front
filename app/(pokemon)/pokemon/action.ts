"use server"

import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

export async function guessPokemonClassic(prevState: any, formData: FormData) {
    const cookie = (await cookies()).get("session")?.value;
      const session = await decrypt(cookie);
      const link = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/pokemons/guess`;
      const name = formData.get("pokemonName");
      
      try {
      const response = await fetch(link, {
        method: "POST",
        headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.token}`,
          },
          body : JSON.stringify({player_id : session?.user.id, name : name})
        });

      const data = await response.json();
      console.log(data);
    } catch(error) {
        console.log(error)
    }
}

export async function guessPokemonPicture(prevState: any, formData: FormData) {
    const cookie = (await cookies()).get("session")?.value;
      const session = await decrypt(cookie);
      const link = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/pokemon_images/guess`;
      const name = formData.get("pokemonName");
      
      try {
      const response = await fetch(link, {
        method: "POST",
        headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.token}`,
          },
        body : JSON.stringify({player_id : session?.user.id, name : name})
      });

      const data = await response.json();
      console.log(data);
    } catch(error) {
        console.log(error)
    }
}