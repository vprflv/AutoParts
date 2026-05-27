import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getCurrentUserId } from '@/lib/auth/auth'; // твоя функция

export async function GET(req: NextRequest) {
    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ success: false }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, username: true, avatarUrl: true, telegramId: true, provider: true }
    });

    if (!user) return NextResponse.json({ success: false }, { status: 404 });

    return NextResponse.json({ success: true, user });
}