import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const authRoutes = ["/upload", "/admin", "/pokemon", "/league"];
const publicRoutes = ["/login"];
const adminRoutes = ["/upload", "/admin"]; // Example admin-only routes
const playerRoutes = ["/", "/pokemon", "/league"]; // Example player-only routes

export default async function middleware(req: NextRequest) {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    const userRole = session?.user?.role;
    const path = req.nextUrl.pathname;
    const isAuthRoute = authRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    if (isPublicRoute && session?.user) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    if (isAuthRoute && !session?.user) {
        return NextResponse.redirect(new URL('/login', req.nextUrl)); // Redirect to login
    }

    if (session?.user) {
        if (adminRoutes.includes(path) && userRole !== "ADMIN") {
            return NextResponse.redirect(new URL('/', req.nextUrl)); // Or some other error page
        }
        if (playerRoutes.includes(path) && userRole !== "PLAYER") {
            return NextResponse.redirect(new URL('/admin', req.nextUrl)); // Or some other error page
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/upload", "/admin", "/pokemon", "/league", "/login"],
};