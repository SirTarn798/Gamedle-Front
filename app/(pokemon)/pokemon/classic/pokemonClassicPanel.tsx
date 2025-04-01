"use client";

import LeagueClassicItem from "@/app/components/LeagueClassicItem";
import PokemonClassicItem from "@/app/components/PokemonClassicItem";
import { championsData, pokemonData } from "@/lib/exampleData";
import { useActionState, useState } from "react";
import { guessPokemonClassic } from "../action";

type Props = {
    userId: string,
}


interface GuessResult {
    data: {
        name: { value: string; correct: boolean };
        type1: { value: string; correct: boolean };
        type2: { value: string | null; correct: boolean };
        height: { value: number; correct: boolean; hint: "Too low" | "Too high" }
        weight: { value: number; correct: boolean; hint: "Too low" | "Too high" };
        attack: { value: number; correct: boolean; hint: "Too low" | "Too high" };
        defence: { value: number; correct: boolean; hint: "Too low" | "Too high" };
        speed: { value: number; correct: boolean; hint: "Too low" | "Too high" };
        generation: { value: string; correct: boolean; hint: "Too low" | "Too high" };
        abilities: { value: string[]; correct: boolean; abilities_match: { match: "none" | "partial" | "exact", matching_abilities: string[] } }
    },
    type: "progress" | "result";
}

export default function PokemonClassicPanel({ userId }: Props) {
    console.log(userId)
    const [guessHistory, setGuessHistory] = useState<GuessResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const pokemonName = formData.get('pokemonName') as string;
        const body = {
            'user_id': userId.toString(),
            'name': pokemonName
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/pokemons/guess`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result)
            const extractedData: GuessResult = [
                ...Object.values(result.progress)
                    .map(entry => ({
                        type: "progress",
                        data: entry.pivot.details.result
                    }))
            ].reverse();

            setGuessHistory(extractedData);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
            (e.target as HTMLFormElement).reset();
        }
    };

    const renderCell = (value: string, correct: boolean) => (
        <div
            className={`p-2 text-center ${correct ? 'bg-green-600' : 'bg-red-600'
                }`}
        >
            {value}
        </div>
    );

    const renderCellNum = (value: string, correct: boolean, hint: string) => (
        <div
            className={`p-2 text-center ${correct ? 'bg-green-600' : 'bg-red-600'
                }`}
        >
            {value} {hint === "Too low" ? "↓" : hint === "Too high" ? "↑" : ""}
        </div>
    );

    const renderCellAbilities = (abilities: { value: string[]; correct: boolean; abilities_match: { match: "none" | "partial" | "exact", matching_abilities: string[] } }) => {
        return (
            <div
              className={`p-2 text-center ${abilities.abilities_match.match === "exact" ? 'bg-green-600' : abilities.abilities_match.match === "partial" ? 'bg-yellow-600' : 'bg-red-600'
                }`}
            >
              {abilities.value.toLocaleString()}
            </div>
          )
    }

    return (
        <div className="flex flex-col items-center gap-8 mt-12 mb-24 w-full max-w-5xl">
            <h1 className="gameBorder1 text-5xl text-zinc-500 tracking-wider cursor-default text:center">
                Who's that Pokémon?
            </h1>
            <form onSubmit={handleFormSubmit} className="relative mb-8">
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

            {loading && <div className="text-white">Loading...</div>}

            {guessHistory.length > 0 && (
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-white border-collapse">
                        <thead>
                            <tr>
                                <th className="p-2 border bg-mainTheme">Name</th>
                                <th className="p-2 border bg-mainTheme">Type 1</th>
                                <th className="p-2 border bg-mainTheme">Type 2</th>
                                <th className="p-2 border bg-mainTheme">Height</th>
                                <th className="p-2 border bg-mainTheme">Weight</th>
                                <th className="p-2 border bg-mainTheme">Attack</th>
                                <th className="p-2 border bg-mainTheme">Defence</th>
                                <th className="p-2 border bg-mainTheme">Speed</th>
                                <th className="p-2 border bg-mainTheme">Generation</th>
                                <th className="p-2 border bg-mainTheme">Abilities</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guessHistory?.map((guess, index) => (
                                <tr key={index}>
                                    <td className="border">{renderCell(guess.data.name.value, guess.data.name.correct)}</td>
                                    <td className="border">{renderCell(guess.data.type1.value, guess.data.type1.correct)}</td>
                                    <td className="border">{renderCell(guess.data.type2.value || "N/A", guess.data.type2.correct)}</td>
                                    <td className="border">{renderCellNum(guess.data.height.value.toString(), guess.data.height.correct, guess.data.height.hint)}</td>
                                    <td className="border">{renderCellNum(guess.data.weight.value.toString(), guess.data.weight.correct, guess.data.weight.hint)}</td>
                                    <td className="border">{renderCellNum(guess.data.attack.value.toString(), guess.data.attack.correct, guess.data.attack.hint)}</td>
                                    <td className="border">{renderCellNum(guess.data.defence.value.toString(), guess.data.defence.correct, guess.data.defence.hint)}</td>
                                    <td className="border">{renderCellNum(guess.data.speed.value.toString(), guess.data.speed.correct, guess.data.speed.hint)}</td>
                                    <td className="border">{renderCellNum(guess.data.generation.value, guess.data.generation.correct, guess.data.generation.hint)}</td>
                                    <td className="border">
                                        {renderCellAbilities(guess.data.abilities)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}
