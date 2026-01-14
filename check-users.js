const { db } = require('./lib/db');

async function checkUsers() {
    const users = await db.query.users.findMany({
        with: {
            memberships: {
                with: {
                    organization: true
                }
            }
        }
    });

    console.log('=== ALL USERS ===');
    users.forEach(user => {
        console.log(`\nUser: ${user.name} (${user.email})`);
        console.log(`Role: ${user.role}`);
        console.log(`Memberships: ${user.memberships.length}`);
        user.memberships.forEach(m => {
            console.log(`  - Org: ${m.organization.name} (${m.organization.type})`);
        });
    });
}

checkUsers().catch(console.error);
