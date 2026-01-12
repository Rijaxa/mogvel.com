import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { db } from "./lib/db"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

if (!process.env.AUTH_SECRET) {
    console.error("❌ CRITICAL ERROR: Missing AUTH_SECRET in environment variables. NextAuth requires this to secure your sessions.");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            async authorize(credentials) {
                const email = credentials.email as string;
                const password = credentials.password as string;

                if (!email || !password) return null;

                const user = await db.user.findUnique({ where: { email } });
                if (!user || !user.password) return null;

                const passwordsMatch = await bcrypt.compare(password, user.password);
                if (passwordsMatch) return user;

                return null;
            }
        })
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        ...authConfig.callbacks, // Keep the authorized callback from config
        async signIn({ user, account }) {
            // Allow OAuth without checks if we ever add it back, but for Credentials it just works if authorize returns user
            if (account?.provider === "credentials") return true;
            return true;
        },
        async session({ session, token }) {
            if (session.user?.email) {
                const dbUser = await db.user.findUnique({ where: { email: session.user.email } });
                if (dbUser) {
                    session.user.id = dbUser.id;
                    (session.user as any).role = dbUser.role;
                    // Parse companyDetails if it's a string (since we changed it to String for SQLite compatibility if needed, or if it is JSON type handled by Prisma)
                    // In our schema we defined it as String? for SQLite, so we parse it.
                    try {
                        (session.user as any).companyDetails = dbUser.companyDetails
                            ? JSON.parse(dbUser.companyDetails as string)
                            : null;
                    } catch (e) {
                        (session.user as any).companyDetails = null;
                    }
                }
            }
            return session;
        }
    },
    debug: process.env.NODE_ENV === 'development',
})
