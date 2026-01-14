
import { db } from './lib/db';
import { users } from './lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function verifyLogin() {
    console.log('🔍 Verifying login for gamtenadze.zura@gmail.com...');
    const email = 'gamtenadze.zura@gmail.com';
    const password = 'zura123';

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) {
            console.error('❌ User not found!');
            process.exit(1);
        }

        console.log('✅ User found:', user.email);
        console.log('🔑 Stored hash:', user.password);

        if (!user.password) {
            console.error('❌ No password set for user!');
            process.exit(1);
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (isValid) {
            console.log('✅ Password "zura123" matches correctly!');
        } else {
            console.error('❌ Password mismatch!');
            // Re-hash the password to see what it should be
            const newHash = await bcrypt.hash(password, 10);
            console.log('ℹ️  New hash for "zura123" would be:', newHash);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
    process.exit(0);
}

verifyLogin();
