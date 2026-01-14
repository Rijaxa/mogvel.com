const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

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
        console.log('❌ NO USERS FOUND!');
        console.log('\n🔧 SOLUTION: You need to REGISTER first before logging in.\n');
        console.log('📝 Steps to create an account:');
        console.log('   1. Make sure dev server is running: npm run dev');
        console.log('   2. Go to: http://localhost:3000/company/login');
        console.log('   3. Click "Register now" button');
        console.log('   4. Fill in ALL fields:');
        console.log('      - Your Name: (e.g., "John Doe")');
        console.log('      - Company Name: (e.g., "Acme Corp")');
        console.log('      - Email: (e.g., "john@acme.com")');
        console.log('      - Password: (minimum 6 characters)');
        console.log('      - Check the Terms checkbox');
        console.log('   5. Click "Create account"\n');
        console.log('💡 After registration, you can login with the same email/password\n');
    } else {
        console.log('✅ Users found in database:\n');
        users.forEach((user, index) => {
            const org = user.membership[0]?.organization;
            console.log(`${index + 1}. 📧 Email: ${user.email}`);
            console.log(`   👤 Name: ${user.name || 'N/A'}`);
            console.log(`   🏢 Organization: ${org?.name || 'N/A'} (Type: ${org?.type || 'N/A'})`);
            console.log(`   🔑 Role: ${user.role}\n`);
        });
        console.log(`\n✅ You can login with any of the above email addresses\n`);
    }

    await db.$disconnect();
}

checkUsers().catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});
