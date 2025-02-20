import Image from "next/image";

function Register() {
  return (
    
      <div className="relative z-10 w-full flex flex-col items-center">
        <h1 className="text-white text-shadow-md text-8xl">REGISTER</h1>

        <form className="w-4/12 bg-mainTheme bg-opacity-50 p-6 rounded-lg">
          <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
            <h1 className="text-xl">Username</h1>
            <input
              type="text"
              className="text-secondaryColor p-2 rounded-md border-2 border-secondaryColor bg-mainTheme text-lg"
              defaultValue="jaoaurai"
            />

            <h1 className="text-xl">Email</h1>
            <input
              type="email"
              className="text-secondaryColor p-2 rounded-md border-2 border-secondaryColor bg-mainTheme text-lg"
            />

            <h1 className="text-xl">Password</h1>
            <input
              type="password"
              className="text-secondaryColor p-2 rounded-md border-2 border-secondaryColor bg-mainTheme text-lg"
            />

            <h1 className="text-xl">Re-enter Password</h1>
            <input
              type="password"
              className="text-secondaryColor p-2 rounded-md border-2 border-secondaryColor bg-mainTheme text-lg"
            />
          </div>
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="border-2 border-white hover:bg-acceptGreen hover:border-0 hover:text-black text-white px-8 py-2 rounded-md transition-colors duration-200 font-medium"
            >
              Sign Up
            </button>
          </div>{" "}
        </form>
      </div>
  );
}

export default Register;
