import Image from "next/image";

function NavBarLogin() {
    return(
        <nav className="flex justify-between w-full h-fit bg-mainTheme border-4 border-borderColor">
            <Image src="/Logo.png" height={120} width={180} alt="Logo" className="m-3"/>
            <div className="flex gap-10 m-3">
                <button className="text-3xl">SIGN IN</button>
                <button className="text-3xl p-2 pixelBorder">SIGN UP</button>
            </div>
        </nav>
    )
}

export default NavBarLogin;