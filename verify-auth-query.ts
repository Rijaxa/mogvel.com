
import { db } from './lib/db';
import { users } from './lib/db/schema';
import { eq } from 'drizzle-orm';

async function verifyAuthQuery() {
    console.log('🔍 Verifying Auth Query Structure...');
    const email = 'gamtenadze.zura@gmail.com';

    try {
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

        if (!user) {
            console.error('❌ User not found via db.query.users.findFirst');
            process.exit(1);
        }

        console.log('✅ User found:', user.email);
        console.log('Keys on user object:', Object.keys(user));

        // Check memberships
        // @ts-ignore
        if (user.memberships) {
            // @ts-ignore
            console.log('✅ memberships found. Count:', user.memberships.length);
            // @ts-ignore
            if (user.memberships.length > 0) {
                // @ts-ignore
                console.log('First membership:', user.memberships[0]);
                // @ts-ignore
                if (user.memberships[0].organization) {
                    // @ts-ignore
                    console.log('✅ Organization found:', user.memberships[0].organization.name);
                } else {
                    console.error('❌ Organization relation missing on membership');
                }
            }
        } else {
            console.error('❌ memberships property missing on user object!');
            console.log('Full user object:', JSON.stringify(user, null, 2));
        }

    } catch (error) {
        console.error('❌ Query crashed:', error);
    }
    process.exit(0);
}

verifyAuthQuery();
