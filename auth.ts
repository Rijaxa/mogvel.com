import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("❌ CRITICAL ERROR: Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in environment variables.");
}
if (!process.env.AUTH_SECRET) {
    console.error("❌ CRITICAL ERROR: Missing AUTH_SECRET in environment variables. NextAuth requires this to secure your sessions.");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.AUTH_SECRET || "fallback_dev_secret", // Explicitly add secret
    pages: {
        signIn: '/company/login',
    },
    debug: process.env.NODE_ENV === 'development',
})
