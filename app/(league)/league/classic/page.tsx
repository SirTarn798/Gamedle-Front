import { cookies } from "next/headers";
import { LeagueClassicPanel } from "./leagueClassicPanel";
import { decrypt } from "@/lib/session";

export default async function LeagueClassic() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const userId : string= session?.user.id;
  return (
    <div className="flex flex-col items-center gap-8 mt-12 mb-24 w-full max-w-5xl">
      <h1 className="text-white text-5xl tracking-wider pixelBorder bg-mainTheme cursor-default">
        Guess The Champion
      </h1>
      <LeagueClassicPanel userId={userId}/>
    </div>
  )
}