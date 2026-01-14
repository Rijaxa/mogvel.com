
import { db } from './lib/db';
import { users } from './lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function verifyAllAccounts() {
    console.log('🔍 Verifying all test accounts...');

    const accounts = [
        { email: 'gamtenadze.zura@gmail.com', password: 'zura123' },
        { email: 'vendor@mogvel.com', password: 'vendor123' },
        { email: 'company@mogvel.com', password: 'company123' }
    ];

    for (const acc of accounts) {
        console.log(`\nChecking ${acc.email}...`);
        const user = await db.query.users.findFirst({
            where: eq(users.email, acc.email),
        });

        if (!user) {
            console.error(`❌ User ${acc.email} NOT FOUND!`);
            continue;
        }

        if (!user.password) {
            console.error(`❌ User ${acc.email} has NO PASSWORD!`);
            continue;
        }

        const isValid = await bcrypt.compare(acc.password, user.password);

        if (isValid) {
            console.log(`✅ Password "${acc.password}" OK`);
        } else {
            console.error(`❌ Password mismatch for ${acc.email}`);
            // Re-hash to see what it expects? No, we can't reverse.
            // But we can suggest updating it.
        }
    }
    process.exit(0);
}

verifyAllAccounts();
