export default function pokemon() {

    return (
        <div className="flex flex-col items-center gap-8 mt-12 w-5/12 max-w-5xl">
            <h1 className=" text-5xl tracking-wider gameBorder1 bg-mainTheme">Choose Your Game</h1>
            <a href="/pokemon/classic" className="text-5xl tracking-wider gameBorder1 bg-mainTheme w-full text-center transition-all duration-200 hover:bg-opacity-80 hover:scale-105">Classic</a>
            <a href="/pokemon/picture" className="text-5xl tracking-wider gameBorder1 bg-mainTheme w-full text-center transition-all duration-200 hover:bg-opacity-80 hover:scale-105">Picture</a>
        </div>
    );
}