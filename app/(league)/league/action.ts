"use server"

import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

export async function guessChampionClassic(prevState: any, formData: FormData) {
    const cookie = (await cookies()).get("session")?.value;
      const session = await decrypt(cookie);
      const link = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/champions/guessOMEWEWEWEWE`;
      const name = formData.get("champName");
      console.log("token : ",  session?.token);
      console.log("id : ",  session?.user.id);
      try {
      const response = await fetch(link, {
        method: "POST",
        headers: {
            Accept: 'application.json',
            Authorization: `Bearer ${session?.token}`,
          },
        body : JSON.stringify({player_id : session?.user.id, name : name})
      });

      console.log(response.status);
    } catch(error) {
        console.log(error)
    }
}