import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react";

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
    const membership = await db.organizationMember.findFirst({
        where: {
            userId,
            status: 'active'
        },
        include: {
            organization: true,
            role: true
        }
    });

    return membership;
});
