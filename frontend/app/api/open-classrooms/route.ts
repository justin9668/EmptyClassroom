import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
    try {
        const response = await fetch('https://emptyclassroom-production.up.railway.app/api/open-classrooms');
        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch data: ${response.status}` },
                { status: response.status }
            );
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error },
            { status: 500 }
        );
    }
}