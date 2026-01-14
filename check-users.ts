import { db } from './lib/db';

async function checkUsers() {
    const users = await db.user.findMany({
        include: {
            membership: {
                include: {
                    organization: true
                }
            }
        }
    });

    console.log(`\n📊 Total users in database: ${users.length}\n`);

    if (users.length === 0) {
        console.log('❌ No users found! You need to REGISTER first before logging in.');
        console.log('\n📝 To create an account:');
        console.log('   1. Go to http://localhost:3000/company/login');
        console.log('   2. Click "Register now"');
        console.log('   3. Fill in: Your Name, Company Name, Email, Password');
        console.log('   4. Click "Create account"\n');
    } else {
        console.log('✅ Users found:\n');
        users.forEach((user, index) => {
            const org = user.membership[0]?.organization;
            console.log(`${index + 1}. Email: ${user.email}`);
            console.log(`   Name: ${user.name || 'N/A'}`);
            console.log(`   Organization: ${org?.name || 'N/A'} (${org?.type || 'N/A'})`);
            console.log(`   Role: ${user.role}\n`);
        });
    }

    await db.$disconnect();
}

checkUsers().catch(console.error);
