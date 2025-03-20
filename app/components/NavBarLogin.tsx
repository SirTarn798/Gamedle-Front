import Image from "next/image";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { logout } from "@/app/(auth)/login/actions"
import NavBarClient from "./NavBarClient";

async function NavBarLogin() {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    const isLoggedIn = !!session?.userId;
    let userArray = null;
    if (session) {
        userArray = Object.values(session);
    }

    return <NavBarClient isLoggedIn={isLoggedIn} onLogout={logout} user={userArray}/>;
}

export default NavBarLogin;