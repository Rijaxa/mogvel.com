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
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Basic safety check – if Auth.js filters out unexpected fields,
                // this prevents undefined access and makes failures explicit.
                if (!credentials?.email || !credentials?.password) {
                    console.warn("[Auth] Missing credentials in authorize()", credentials);
                    return null;
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                const user = await db.user.findUnique({
                    where: { email },
                    include: {
                        membership: {
                            include: {
                                organization: true
                            }
                        }
                    }
                });

                if (!user || !user.password) return null;

                const passwordsMatch = await bcrypt.compare(password, user.password);

                if (passwordsMatch) {
                    // Return user with extended properties
                    const extendedUser: any = { ...user };

                    const primaryMembership = user.membership[0];
                    if (primaryMembership && primaryMembership.organization) {
                        extendedUser.orgId = primaryMembership.organizationId;
                        extendedUser.orgType = primaryMembership.organization.type;
                    }
                    return extendedUser;
                }

                return null;
            }
        })
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, account }) {
            if (account?.provider === "credentials") return true;
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            // Initial sign in or update
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.orgId = (user as any).orgId;
                token.orgType = (user as any).orgType;
                token.companyDetails = (user as any).companyDetails;
            }
            return token;
        },
        async session({ session, token }) {
            // Session callback should ideally just read from token to be lightweight
            // But if we want real-time DB changes to reflect, we can keep the DB call.
            // For middleware consistency, reliance on token is Key.

            if (token && session.user) {
                session.user.id = token.id as string;
                (session.user as any).role = token.role;
                (session.user as any).orgId = token.orgId; // Crucial for Middleware
                (session.user as any).orgType = token.orgType; // Crucial for Middleware
                (session.user as any).companyDetails = token.companyDetails;
            }
            return session;
        }
    },
    debug: false,
})
