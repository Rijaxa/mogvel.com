import { NextRequest, NextResponse } from 'next/server';
import { checkPermission } from '@/lib/auth/permissions';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { resource, action } = body;

        if (!resource || !action) {
            return NextResponse.json(
                { error: 'Resource and action are required' },
                { status: 400 }
            );
        }

        const allowed = await checkPermission(resource, action);

        return NextResponse.json({ allowed });
    } catch (error) {
        console.error('Permission check API error:', error);
        return NextResponse.json(
            { error: 'Failed to check permission' },
            { status: 500 }
        );
    }
}
