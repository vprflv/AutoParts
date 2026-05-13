// app/api/auth/magic/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

export async function POST(request: NextRequest) {
    try {
        const { telegramId, name, username, avatarUrl } = await request.json();

        if (!telegramId) {
            return NextResponse.json({ success: false, error: "Нет telegramId" }, { status: 400 });
        }

        let user = await prisma.user.findUnique({
            where: { telegramId: String(telegramId) }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    telegramId: String(telegramId),
                    name: name || "Telegram User",
                    username,
                    avatarUrl,
                    provider: "telegram"
                }
            });
        }

        const sessionToken = sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Устанавливаем httpOnly cookie
        const cookieStore = await cookies();
        cookieStore.set('session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60,
            path: '/'
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                avatarUrl: user.avatarUrl
            }
        });

    } catch (error: any) {
        console.error("Magic error:", error);
        return NextResponse.json({ success: false, error: "Внутренняя ошибка" }, { status: 500 });
    }
}