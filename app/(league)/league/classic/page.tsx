type LeagueClassicInput = {
    
}

function LeagueClassic() {
  return (
    <div className="flex flex-col items-center gap-20 mt-12 w-5/12">
      <h1 className="text-white text-5xl tracking-wider pixelBorder bg-mainTheme">
        Guess The Champion
      </h1>
      <form action="" className="w-full relative">
        <input
          type="text"
          className="w-full p-3 bg-mainTheme border-4 border-white text-lg"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <img src="/arrowheads.png" alt="Submit" width={65}/>
        </button>
      </form>
    </div>
  );
}

export default LeagueClassic;
