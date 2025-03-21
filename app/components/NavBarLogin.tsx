import Image from "next/image";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { logout } from "@/app/(auth)/login/actions"
import NavBarClient from "./NavBarClient";

async function NavBarLogin() {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    const isLoggedIn = !!session?.user;
    
    if (session?.user) {
        return <NavBarClient isLoggedIn={isLoggedIn} onLogout={logout} userName={session.user.name} userRole={session.user.role} userPoint={session.user.points} />;
    }
    return <NavBarClient isLoggedIn={isLoggedIn} onLogout={logout} />;
}

export default NavBarLogin;