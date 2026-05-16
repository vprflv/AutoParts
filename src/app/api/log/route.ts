import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { message, type = 'info', source } = await request.json();

        console.log(`[${type.toUpperCase()}] ${source || 'Frontend'}: ${message}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Log error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}