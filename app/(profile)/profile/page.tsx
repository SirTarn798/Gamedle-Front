import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

export default async function profile() {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    const userId = session?.user?.id
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/users/${userId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return <div className="py-4 px-6 bg-red-100 text-red-700 rounded-md shadow-md">Error fetching profile data</div>;
        }

        const data = await response.json();

        return (
            <div className="py-20 mx-auto w-[600px]">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="bg-indigo-500 text-white py-4 px-6">
                        <h2 className="text-2xl font-semibold text-center">Profile</h2>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-700 mb-5">General Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="block text-gray-700 text-sm font-bold mb-2">ID:</div>
                                <div className="text-gray-800">{data?.data?.id}</div>
                                <div className="block text-gray-700 text-sm font-bold mb-2">Name:</div>
                                <div className="text-gray-800">{data?.data?.name}</div>
                                <div className="block text-gray-700 text-sm font-bold mb-2">Email:</div>
                                <div className="text-gray-800">{data?.data?.email}</div>
                                {/* <div className="block text-gray-700 text-sm font-bold mb-2">Role:</div>
                                <div className="text-gray-800">{data?.data?.role}</div> */}
                        </div>
                        {data?.data?.player && (
                            <div className="mt-6 border-t pt-4">
                                <h3 className="text-xl font-semibold text-gray-700 mb-3">Player Information</h3>
                                <div className="bg-yellow-100 border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
                                    <strong className="font-bold">Points:</strong>
                                    <span className="ml-2 font-semibold text-lg">{data.data.player.points}</span>
                                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                        <svg className="fill-current h-6 w-6 text-yellow-500" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    </span>
                                </div>
                                {/* Add other player details with similar styling if needed */}
                                {/* {data.data.player.champion_id && (
                                    <p className="text-gray-800 text-sm">• Last game Champion ID: {data.data.player.champion_id}</p>
                                )}
                                {data.data.player.pokemon_id && (
                                    <p className="text-gray-800 text-sm">• Last game Pokemon ID: {data.data.player.pokemon_id}</p>
                                )} */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error during fetch:", error);
        return <div className="py-4 px-6 bg-red-100 text-red-700 rounded-md shadow-md">Error fetching profile data</div>;
    }
}