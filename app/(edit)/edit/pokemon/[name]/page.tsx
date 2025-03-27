import PokemonInfo from "@/app/components/PokemonInfo";
import { pokemon } from "@/lib/type";

const poke: pokemon = {
  id: 1,
  name: "Abra",
  type1: "Psychic",
  type2: null,
  height: 0.9,
  weight: 19.5,
  attack : 5,
  defense : 5,
  speed : 5,
  abilities: ["Synchronize", "Inner-focus", "Magic-guard"],
  generation: 1,
  pictures: ["https://pub-47e4cb4a2e98498e8f51f7d685ba74e0.r2.dev/pokemon/picture/Abra/2025-03-25T16%3A01%3A23.487Z.jpg", "https://pub-47e4cb4a2e98498e8f51f7d685ba74e0.r2.dev/pokemon/picture/Abra/2025-03-25T16%3A01%3A24.906Z.jpg"]
};

export default function EditChampion() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-normal mb-6">Edit Champion</h1>
      <PokemonInfo pokemon={poke}/>
    </div>
  );
}