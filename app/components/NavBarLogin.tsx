// "use client"
import Image from "next/image";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { logout } from "@/app/(auth)/login/actions"

async function NavBarLogin() {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    if(session) {
        const userId = session.userId;
        // const userName
        console.log("session",session)
        console.log("userID", userId)
        return(
            <nav className="flex justify-between w-full h-fit bg-mainTheme border-4 border-borderColor">
                <Image src="/Logo.png" height={120} width={180} alt="Logo" className="m-3"/>
                <div className="flex gap-10 m-3 text-white">
                    <div>NAME</div>
                    {/* <button onClick={()=>logout()}>logout</button> */}
                </div>
            </nav>
        )
    } else {
        return(
            <nav className="flex justify-between w-full h-fit bg-mainTheme border-4 border-borderColor">
                <Image src="/Logo.png" height={120} width={180} alt="Logo" className="m-3"/>
                <div className="flex gap-10 m-3 text-white">
                    <a href="/login">
                        <button className="text-3xl">SIGN IN</button>
                    </a>
                    <a href="/register">
                       <button className="text-3xl p-2 pixelBorder">SIGN UP</button>
                    </a>
                </div>
            </nav>
        )
    }
}

export default NavBarLogin;