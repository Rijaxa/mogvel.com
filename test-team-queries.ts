// Test script to verify team queries work
import { db } from './lib/db';
import { roles, organizationMembers, users, organizations } from './lib/db/schema';
import { eq, asc, desc } from 'drizzle-orm';

async function testQueries() {
    console.log('🔍 Testing team management queries...\n');

    try {
        // Test 1: Get all roles
        console.log('1. Testing roles query...');
        const allRoles = await db.query.roles.findMany({
            orderBy: [asc(roles.name)],
        });
        console.log(`✅ Found ${allRoles.length} roles:`, allRoles.map(r => r.name));

        // Test 2: Get roles for specific organization
        const testOrgId = 'ba2575a6-9499-4153-9258-216a673a01fc'; // Acme Corporation
        console.log(`\n2. Testing roles for org ${testOrgId}...`);
        const orgRoles = await db.query.roles.findMany({
            where: eq(roles.organizationId, testOrgId),
            orderBy: [asc(roles.name)],
        });
        console.log(`✅ Found ${orgRoles.length} roles for org:`, orgRoles.map(r => r.name));

        // Test 3: Get team members
        console.log(`\n3. Testing team members query...`);
        const members = await db.query.organizationMembers.findMany({
            where: eq(organizationMembers.organizationId, testOrgId),
            with: {
                user: true,
                role: true,
            },
            orderBy: [desc(organizationMembers.createdAt)],
        });
        console.log(`✅ Found ${members.length} members:`);
        members.forEach(m => {
            console.log(`  - ${m.user.email} (${m.role.name}) - Status: ${m.status}`);
        });

        // Test 4: Get team activities
        console.log(`\n4. Testing team activities query...`);
        const activities = await db.query.teamActivities.findMany({
            where: eq(organizationMembers.organizationId, testOrgId),
            orderBy: [desc(organizationMembers.createdAt)],
            limit: 10,
        });
        console.log(`✅ Found ${activities.length} activities`);

        console.log('\n✅ All queries successful!');
    } catch (error) {
        console.error('❌ Query failed:', error);
        process.exit(1);
    }

    process.exit(0);
}

testQueries();
