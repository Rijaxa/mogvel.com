import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("❌ CRITICAL ERROR: Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in environment variables.");
}
if (!process.env.AUTH_SECRET) {
    console.error("❌ CRITICAL ERROR: Missing AUTH_SECRET in environment variables. NextAuth requires this to secure your sessions.");
}

import { db } from "./lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.AUTH_SECRET || "fallback_dev_secret",
    callbacks: {
        async signIn({ user }) {
            if (user.email) {
                const existingUser = db.getUserByEmail(user.email);
                if (!existingUser) {
                    db.createUser({
                        email: user.email,
                        name: user.name || 'Unknown',
                        role: user.email === 'purtseladze.nino@gmail.com' ? 'admin' : 'user',
                        companyDetails: {
                            isProfileComplete: false
                        }
                    });
                }
            }
            return true;
        },
        async session({ session }) {
            if (session.user?.email) {
                const dbUser = db.getUserByEmail(session.user.email);
                if (dbUser) {
                    session.user.id = dbUser.id; // 6-digit ID
                    // NextAuth session types might need extending, but JS won't complain at runtime
                    (session.user as any).role = dbUser.role;
                    (session.user as any).companyDetails = dbUser.companyDetails;
                }
            }
            return session;
        }
    },
    pages: {
        signIn: '/company/login',
    },
    debug: process.env.NODE_ENV === 'development',
})
