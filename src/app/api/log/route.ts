import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { message, type = 'info' } = await request.json();
        console.log(`[TELEGRAM WEBAPP ${type.toUpperCase()}] ${message}`);
        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ ok: false });
    }
}