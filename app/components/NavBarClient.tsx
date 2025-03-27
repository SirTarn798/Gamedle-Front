'use client'

import Image from "next/image";
import Link from "next/link";

function NavBarClient({ isLoggedIn, onLogout, userName, userRole, userPoint }: {isLoggedIn: boolean, onLogout: any, userName?: string, userRole?: string, userPoint?: number}) {
    if(!isLoggedIn) {
        return(
            <nav className="flex justify-between w-full h-fit bg-mainTheme border-4 border-borderColor items-center">
                <Link href="/">
                    <Image src="/Logo.png" height={120} width={180} alt="Logo" className="m-3"/>
                </Link>
                <div className="flex gap-10 m-3 text-white items-center text-3xl">
                    <Link href="/login">
                        <button className="">SIGN IN</button>
                    </Link>
                    <Link href="/register">
                        <button className="p-2 pixelBorder">SIGN UP</button>
                    </Link>
                </div>
            </nav>
        )
    }
    return(
        <nav className="flex justify-between w-full h-fit bg-mainTheme border-4 border-borderColor items-center">
            <div>
            {userRole === "ADMIN" ? (
                <Link href="/admin">
                    <Image src="/Logo.png" height={120} width={180} alt="Logo" className="m-3"/>
                </Link>
            ) : (
                <Link href="/">
                    <Image src="/Logo.png" height={120} width={180} alt="Logo" className="m-3"/>
                </Link>
            )}
            </div>

            <div className="flex gap-10 m-3 text-white items-center text-xl">
                <div className="flex-col">
                    <div>name : {userName}</div>
                    <div>role {userRole}</div>
                    <div>
                        {userRole === "ADMIN" ? null : (
                            <div>point {userPoint}</div>
                        )}
                    </div>
                </div>
                <button onClick={onLogout} className="text-3xl p-2 pixelBorder">logout</button>
            </div>
        </nav>
    )
}

export default NavBarClient;