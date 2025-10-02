import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
    try {
        const response = await fetch('https://emptyclassroom-production.up.railway.app/api/cooldown-status');
        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch cooldown status: ${response.status}` },
                { status: response.status }
            );
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { error: 'Failed to fetch cooldown status' },
            { status: 500 }
        );
    }
}