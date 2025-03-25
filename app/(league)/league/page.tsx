import Link from "next/link";

function League() {

    return (
        <div className="flex flex-col items-center gap-8 mt-12 w-5/12 max-w-5xl">
            <h1 className="text-white text-5xl tracking-wider pixelBorder bg-mainTheme">Choose Your Game</h1>
            <Link href="/league/classic" className="text-white text-5xl tracking-wider pixelBorder bg-mainTheme w-full text-center transition-all duration-200 hover:bg-opacity-80 hover:scale-105">Classic</Link>
            <Link href="/league/picture" className="text-white text-5xl tracking-wider pixelBorder bg-mainTheme w-full text-center transition-all duration-200 hover:bg-opacity-80 hover:scale-105">Picture</Link>
            <Link href="/league/runeterra_reflex" className="text-white text-5xl tracking-wider pixelBorder bg-mainTheme w-full text-center transition-all duration-200 hover:bg-opacity-80 hover:scale-105">Runeterra Reflex</Link>

        </div>
    );
}

export default League;