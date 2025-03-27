"use client";

import LeagueClassicItem from "@/app/components/LeagueClassicItem";
import { championsData } from "@/lib/exampleData";
import { useActionState, useState } from "react";
import { guessChampionPicture } from "../action";

function LeagueClassic() {

    const [zoomLevel, setZoomLevel] = useState(24);
    const [state, guessChamp] = useActionState(guessChampionPicture, undefined);

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(1, prev - 2));
    };

    return (
        <div className="flex flex-col items-center gap-8 mt-12 w-full max-w-5xl">
            <h1 className="text-white text-5xl tracking-wider pixelBorder bg-mainTheme">
                Guess The Champion
            </h1>

            <form action={guessChamp} className="w-full relative mb-8">
                <input
                    type="text"
                    className="w-full p-3 bg-mainTheme border-4 border-white text-lg"
                    name="champName"
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                    <img src="/arrowheads.png" alt="Submit" width={65} />
                </button>
            </form>

            <div className="flex flex-col items-center gap-4 p-10 py-16">
                <div className="w-124 h-96 overflow-hidden border-4">
                    <img
                        src="/ArcadeBG.png"
                        alt="Zoomable image"
                        className="w-full h-full object-cover transition-transform duration-500"
                        style={{
                            transform: `scale(${zoomLevel})`,
                        }}
                    />
                </div>

                <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg
                   hover:bg-blue-600 transition-colors
                   disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Zoom Out
                </button>

                <div className="text-sm text-white">
                    Current zoom: {zoomLevel.toFixed(1)}x
                </div>
            </div>

            <img src="/LeagueMain.png"/>
        </div>
    );
}

export default LeagueClassic;