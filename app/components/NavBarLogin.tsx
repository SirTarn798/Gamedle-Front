import Image from "next/image";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { logout } from "@/app/(auth)/login/actions"
import NavBarClient from "./NavBarClient";

async function NavBarLogin() {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    const isLoggedIn = !!session?.userId;
    const userName = session?.userId;
    const userId = session?.userId;
    
    return <NavBarClient isLoggedIn={isLoggedIn} onLogout={logout} userName={userName} userID={userId}/>;
}

export default NavBarLogin;