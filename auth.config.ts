import type { NextAuthConfig } from "next-auth"

export default {
    providers: [], // Providers added in auth.ts for Node runtime compatibility
    pages: {
        signIn: '/company/login',
    },
    // Add simple authorized callback if needed for middleware protection
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
    },
    // Explicitly add secret if needed, though NextAuth v5 usually infers it from AUTH_SECRET
    // secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;

