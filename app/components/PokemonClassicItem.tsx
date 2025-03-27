import { pokemon } from "@/lib/type";

export default PokemonClassicItem;

const getStatusColor = (status: boolean) => {
  return status ? "bg-green-400" : "bg-orange-400";
};

function PokemonClassicItem(props: pokemon) {
  return (
    <div className="w-full grid grid-cols-7 items-center gap-4">
      <div className="flex justify-center">
        <div className="w-12 h-12 overflow-hidden rounded">
          <img
            src={props.image}
            alt="Champion"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div
        className={`p-2 text-center rounded bg-green-400`}
      >
        {props.type1}
      </div>
      <div
        className={`p-2 text-center rounded bg-green-400`}
      >
        {props.type2}
      </div>
      <div
        className={`p-2 text-center rounded bg-green-400`}
      >
        {props.generation}
      </div>
      <div
        className={`p-2 text-center rounded bg-green-400`}
      >
        {props.attack}
      </div>
      <div
        className={`p-2 text-center rounded bg-green-400`}
      >
        {props.speed}
      </div>
      <div
        className={`p-2 text-center rounded bg-green-400`}
      >
        {props.defense}
      </div>
    </div>
  );
}