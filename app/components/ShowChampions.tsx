import { LeagueSearch } from "@/lib/type";

function ShowChampions(props : LeagueSearch) {
    return(
        <div className="flex w-full gap-10 p-6 transition-all duration-200 hover:bg-opacity-80 hover:scale-105 hover:bg-zinc-900">
            <img src={props.icon_url} alt="" width={75} height={100}/>
            <div className="flex gap-3 flex-col">
                <h1>{props.name}</h1>
                <h1>Title: {props.title}</h1>
                <h1>Roles: 
                    {props.roles.map((role, index) => (
                        <span key={index} className="ml-[10px]">
                            {role}
                            {index < props.roles.length - 1 && ', '} {/* Add a comma and space if it's not the last role */}
                        </span>
                    ))}
                </h1>
            </div>
        </div>
    )
}

export default ShowChampions;