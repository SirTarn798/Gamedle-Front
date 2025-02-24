import ShowChampions from "@/app/components/ShowChampions";
import { searchChampionData } from "@/lib/exampleData";

function SearchChampion() {
    return (
        <div className="flex flex-col items-center gap-8 mt-12 w-full max-w-5xl">
            <h1 className="text-white text-5xl tracking-wider pixelBorder bg-mainTheme">
                Search Champions
            </h1>

            <form action="" className="w-full relative mb-8">
                <input
                    type="text"
                    className="w-full p-3 bg-mainTheme border-4 border-white text-lg"
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                    <img src="/arrowheads.png" alt="Submit" width={65} />
                </button>
            </form>


            {
                searchChampionData.map((champion, index) => (
                    <ShowChampions key={index} {...champion} />
                ))
            }
        </div>
    )
}

export default SearchChampion;