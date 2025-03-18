// NavBarClient.js
'use client'

import Image from "next/image";

function NavBarClient({ isLoggedIn, onLogout, userName, userID }) {
    if(!isLoggedIn) {
        return(
            <nav className="flex justify-between w-full h-fit bg-mainTheme border-4 border-borderColor items-center">
                <a href="/">
                    <Image src="/Logo.png" height={120} width={180} alt="Logo" className="m-3"/>
                </a>
                <div className="flex gap-10 m-3 text-white items-center text-3xl">
                    <a href="/login">
                        <button className="">SIGN IN</button>
                    </a>
                    <a href="/register">
                        <button className="p-2 pixelBorder">SIGN UP</button>
                    </a>
                </div>
            </nav>
        )
    }
    return(
        <nav className="flex justify-between w-full h-fit bg-mainTheme border-4 border-borderColor items-center">
            <a href="/">
                <Image src="/Logo.png" height={120} width={180} alt="Logo" className="m-3"/>
            </a>
            <div className="flex gap-10 m-3 text-white items-center text-3xl">
                <img></img>
                <div className="flex-col">
                    <div>userName : {userName}</div>
                    <div>score</div>
                </div>
                <button onClick={onLogout} className="text-3xl p-2 pixelBorder">logout</button>
            </div>
        </nav>
    )
}

export default NavBarClient;