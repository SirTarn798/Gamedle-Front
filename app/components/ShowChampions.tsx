import { LeagueSearch } from "@/lib/type";

function ShowChampions(props : LeagueSearch) {
    return(
        <div className="flex w-4/6 gap-10">
            <img src={props.image} alt="" width={75} height={100}/>
            <div className="flex gap-3 flex-col">
                <h1>{props.name}</h1>
                <h1>{props.title}</h1>
            </div>
        </div>
    )
}

export default ShowChampions;