import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import RuneterraReflexCanvas from "./leagueRR";

export default async function LeagueClassic() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const username : string= session?.user.name;
  return (
    <div className="flex flex-col items-center gap-8 mt-12 mb-24 w-full max-w-5xl">
      
      <RuneterraReflexCanvas username={username}/>
    </div>
  )
}