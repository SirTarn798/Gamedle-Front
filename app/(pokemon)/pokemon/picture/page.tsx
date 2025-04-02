import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import PokemonPicturePanel from "./pokemonPicturePanel";

export default async function PokemonClassic() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const userId : string= session?.user.id;
  return (
    <div className="flex flex-col items-center gap-8 mt-12 mb-24 w-full max-w-5xl">
      
      <PokemonPicturePanel userId={userId}/>
    </div>
  )
}