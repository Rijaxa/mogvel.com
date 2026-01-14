import { auth } from "@/auth";
import { db } from "@/lib/db";
import { organizationMembers, organizations, roles } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import { cache } from "react";
import { eq, and } from "drizzle-orm";

export const getCurrentSession = cache(async () => {
    const session = await auth();
    return session;
});

export const requireUser = async () => {
    const session = await getCurrentSession();
    if (!session || !session.user) {
        redirect("/company/login"); // or generic /login
    }
    return session.user;
};

export const getActiveOrganization = cache(async (userId: string) => {
    const membership = await db.query.organizationMembers.findFirst({
        where: and(
            eq(organizationMembers.userId, userId),
            eq(organizationMembers.status, 'active')
        ),
        with: {
            organization: true,
            role: true
        }
    });

    return membership;
});
