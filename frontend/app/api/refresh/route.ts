import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse> {
    try {
        const response = await fetch('https://emptyclassroom-production.up.railway.app/api/refresh', {
            method: 'POST',
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.detail || `Failed to refresh data: ${response.status}` },
                { status: response.status }
            );
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { error: 'Failed to refresh data' },
            { status: 500 }
        );
    }
}
