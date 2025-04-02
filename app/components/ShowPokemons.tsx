import { LeagueSearch } from "@/lib/type";
import { redirect } from "next/navigation";

function ShowPokemons(props) {
const handleClick = () => {
        redirect(`/admin/champions/${props.id}/edit`)
    }
    return(
        <div onClick={handleClick} className="cursor-pointer flex w-full gap-10 p-6 transition-all duration-200 hover:bg-opacity-80 hover:scale-105 hover:bg-zinc-900">
            <img src={props.images[0]} alt="" width={75} height={100}/>
            <div className="flex gap-3 flex-col">
                <h1>{props.name}</h1>
                <h1>Type1: {props.type1}<span className="ml-[20px]">Type2: {props.type2}</span></h1>
            </div>
        </div>
    )
}

export default ShowPokemons;