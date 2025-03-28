"use client";

import { useActionState, useState } from "react";
import { guessPokemonClassic } from "../action";

export default function PokemonPicture() {

    const [zoomLevel, setZoomLevel] = useState(24);
    const [state, guessPokemon] = useActionState(guessPokemonClassic, undefined);

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(1, prev - 2));
    };

    return (
        <div className="flex flex-col items-center gap-8 mt-12 w-full max-w-5xl">
            <h1 className="gameBorder1 text-5xl tracking-wider cursor-default text:center">
                Who's that Pokémon?
            </h1>

            <form action={guessPokemon} className="relative mb-8">
                <div className=" gameBorder2 flex flex-row flex-nowrap gap-[30px] px-[30px] py-[15px]">
                    <input
                        type="text"
                        className="w-75% focus:outline-none focus:ring-0 border-none bg-transparent text-2xl text-white"
                        name="pokemonName"
                    />
                    <button
                        type="submit"
                        className=""
                    >
                        <img className="animate" src="/enter.png" alt="Submit" width={65} />
                    </button>
                </div>
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

                <div className="text-sm">
                    Current zoom: {zoomLevel.toFixed(1)}x
                </div>
            </div>

            <img src="/LeagueMain.png"/>
        </div>
    );
}