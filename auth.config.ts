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
            const user = auth?.user as any;

            // Detailed Route Checks
            const isVendorDashboard = nextUrl.pathname.startsWith('/dashboard/vendor');
            // Anything under /dashboard that is NOT /dashboard/vendor is considered Company Dashboard
            const isCompanyDashboard = nextUrl.pathname.startsWith('/dashboard') && !nextUrl.pathname.startsWith('/dashboard/vendor');

            if (isVendorDashboard || isCompanyDashboard) {
                if (!isLoggedIn) return false;

                // Hierarchy Enforcement
                const orgType = user.orgType; // 'vendor' or 'company'

                // If orgType is missing (shouldn't happen with session callback below), redirect to login to refresh
                if (!orgType) {
                    // console.log("Missing orgType in middleware, redirecting to login");
                    return false;
                }

                if (isVendorDashboard && orgType !== 'vendor') {
                    // Company User accessing Vendor Dashboard -> Redirect to Company Dashboard
                    return Response.redirect(new URL('/dashboard/orders', nextUrl));
                }

                if (isCompanyDashboard && orgType !== 'company') {
                    // Vendor User accessing Company Dashboard -> Redirect to Vendor Dashboard
                    return Response.redirect(new URL('/dashboard/vendor', nextUrl));
                }

                return true;
            }

            // Login Redirects (Optional: if they land on /login, move them to dashboard)
            if (isLoggedIn) {
                if (nextUrl.pathname === '/company/login') {
                    return Response.redirect(new URL('/dashboard/orders', nextUrl));
                }
                if (nextUrl.pathname === '/vendor/login') {
                    return Response.redirect(new URL('/dashboard/vendor', nextUrl));
                }
            }

            return true;
        },
        async session({ session, token }) {
            // Map token fields to session user for Middleware access
            if (token && session.user) {
                session.user.id = token.id as string;
                (session.user as any).role = token.role;
                (session.user as any).orgId = token.orgId;
                (session.user as any).orgType = token.orgType;
                (session.user as any).companyDetails = token.companyDetails;
            }
            return session;
        }
    },
    // Explicitly add secret if needed, though NextAuth v5 usually infers it from AUTH_SECRET
    // secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;

