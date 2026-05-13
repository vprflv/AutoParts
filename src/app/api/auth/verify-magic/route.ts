import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();
        if (!token) return NextResponse.json({ success: false, error: "Нет токена" }, { status: 400 });

        const magic = await prisma.magicToken.findUnique({
            where: { token }
        });

        if (!magic || magic.used || magic.expiresAt < new Date()) {
            return NextResponse.json({ success: false, error: "Ссылка недействительна или истекла" }, { status: 400 });
        }

        // Находим или создаём пользователя
        let user = await prisma.user.findUnique({ where: { telegramId: magic.telegramId } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    telegramId: magic.telegramId,
                    name: magic.name,
                    username: magic.username,
                    avatarUrl: magic.avatarUrl,
                    provider: "telegram"
                }
            });
        }

        // Помечаем токен использованным
        await prisma.magicToken.update({
            where: { id: magic.id },
            data: { used: true }
        });

        const sessionToken = sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

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

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: "Внутренняя ошибка" }, { status: 500 });
    }
}