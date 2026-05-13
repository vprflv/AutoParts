import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
    try {
        const { telegramId, name, username, avatarUrl } = await request.json();

        if (!telegramId) {
            return NextResponse.json({ success: false, error: "Нет telegramId" }, { status: 400 });
        }

        let user = await prisma.user.findUnique({ where: { telegramId: String(telegramId) } });

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

        // === Создаём Magic Token ===
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

        await prisma.magicToken.create({
            data: {
                token,
                telegramId: String(telegramId),
                name: user.name,
                username: user.username,
                avatarUrl: user.avatarUrl,
                expiresAt,
            }
        });

        const magicLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/magic?token=${token}`;

        return NextResponse.json({
            success: true,
            magicLink
        });

    } catch (error: any) {
        console.error("Magic error:", error);
        return NextResponse.json({ success: false, error: "Внутренняя ошибка" }, { status: 500 });
    }
}