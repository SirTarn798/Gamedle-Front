import ChampionInfo from "@/app/components/ChampionInfo";
import { champion } from "@/lib/type";

const champ: champion = {
    id : 1,
  name: "Aatrox",
  region: "Runeterra",
  class: "Juggernaut",
  gender: "male",
  nick_name: "The Darkin Blade",
  role: ["top", "mid"],
  range_type: "melee",
  resource_type: "Blood Well",
  release_date: new Date("2013-06-13"),
  icon: "https://ddragon.leagueoflegends.com/cdn/15.6.1/img/champion/Aatrox.png",
  pictures : ["https://pub-47e4cb4a2e98498e8f51f7d685ba74e0.r2.dev/champion/picture/Aatrox/2025-03-24T17%3A47%3A56.466Z.jpg", "https://pub-47e4cb4a2e98498e8f51f7d685ba74e0.r2.dev/champion/picture/Aatrox/2025-03-24T17%3A47%3A56.882Z.jpg", "https://pub-47e4cb4a2e98498e8f51f7d685ba74e0.r2.dev/champion/picture/Aatrox/2025-03-24T17%3A47%3A57.320Z.jpg"]
};

export default function EditChampion() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-normal mb-6">Edit Champion</h1>
      <ChampionInfo champ={champ} />
    </div>
  );
}