import { LeagueSearch } from "@/lib/type";

function ShowChampions(props : LeagueSearch) {
    return(
        <div className="flex w-full gap-10 p-6 transition-all duration-200 hover:bg-opacity-80 hover:scale-105 hover:bg-zinc-900">
            <img src={props.image} alt="" width={75} height={100}/>
            <div className="flex gap-3 flex-col">
                <h1>{props.name}</h1>
                <h1>{props.title}</h1>
            </div>
        </div>
    )
}

export default ShowChampions;