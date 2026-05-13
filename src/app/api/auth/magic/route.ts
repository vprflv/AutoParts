// app/api/auth/magic/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

export async function POST(request: NextRequest) {
    try {
        const { telegramId, name, username, avatarUrl } = await request.json();

        if (!telegramId) {
            return NextResponse.json({ success: false, error: "Нет telegramId" }, { status: 400 });
        }

        // Ищем или создаём пользователя
        let user = await prisma.user.findUnique({
            where: { telegramId }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    telegramId,
                    name: name || "Telegram User",
                    username,
                    avatarUrl,
                    provider: "telegram"
                }
            });
        }

        // Создаём одноразовый токен
        const token = sign(
            {
                userId: user.id,
                telegramId: user.telegramId
            },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Сохраняем токен в БД
        await prisma.magicToken.create({
            data: {
                token,
                telegramId,
                name: user.name,
                username: user.username,
                avatarUrl: user.avatarUrl,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000)
            }
        });

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const magicLink = `${siteUrl}/auth/magic?token=${token}`;

        return NextResponse.json({
            success: true,
            magicLink
        });

    } catch (error: any) {
        console.error("Magic link error:", error);
        return NextResponse.json({
            success: false,
            error: "Внутренняя ошибка"
        }, { status: 500 });
    }
}