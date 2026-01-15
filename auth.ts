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
                console.log('🔐 [Auth] Authorize called with:', { email: credentials?.email });

                if (!credentials?.email || !credentials?.password) {
                    console.warn("[Auth] Missing credentials");
                    return null;
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                try {
                    console.log('🔍 [Auth] Looking up user:', email);
                    const user = await db.query.users.findFirst({
                        where: (users, { eq }) => eq(users.email, email),
                        with: {
                            memberships: {
                                with: {
                                    organization: true
                                }
                            }
                        }
                    });

                    console.log('👤 [Auth] User found:', !!user);

                    if (!user || !user.password) {
                        console.warn("[Auth] User not found or has no password");
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    console.log('🔑 [Auth] Password match:', passwordsMatch);

                    if (passwordsMatch) {
                        const extendedUser: any = { ...user };
                        const primaryMembership = user.memberships[0];

                        if (primaryMembership && primaryMembership.organization) {
                            extendedUser.orgId = primaryMembership.organizationId;
                            extendedUser.orgType = primaryMembership.organization.type;
                        }

                        console.log('✅ [Auth] Login successful for:', email);
                        return extendedUser;
                    }

                    console.warn("[Auth] Invalid password");
                    return null;
                } catch (error) {
                    console.error("❌ [Auth] Authorization error:", error);
                    return null;
                }
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
                token.lastName = (user as any).lastName;
                token.phone = (user as any).phone;
                token.jobPosition = (user as any).jobPosition;
            }
            // Support trigger="update" for client-side session updates
            if (trigger === "update" && session) {
                token.name = session.name;
                token.lastName = session.lastName;
                token.phone = session.phone;
                token.jobPosition = session.jobPosition;
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
                (session.user as any).lastName = token.lastName;
                (session.user as any).phone = token.phone;
                (session.user as any).jobPosition = token.jobPosition;
            }
            return session;
        }
    },
    debug: false,
})
