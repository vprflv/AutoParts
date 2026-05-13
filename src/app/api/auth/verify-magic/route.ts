import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

export async function POST(request: NextRequest) {
    console.log("🔥 verify-magic вызван!");

    try {
        // ←←← ДИАГНОСТИКА
        const bodyText = await request.text();
        console.log("📥 Получено тело запроса:", bodyText);

        let body;
        try {
            body = JSON.parse(bodyText);
            console.log("📦 Распарсено:", body);
        } catch (e) {
            console.log("❌ Не удалось распарсить JSON");
        }

        const token = body?.token;
        console.log("🔑 Извлечённый token:", token ? token.substring(0, 30) + "..." : "❌ ОТСУТСТВУЕТ");

        if (!token) {
            return NextResponse.json({
                success: false,
                error: "Токен не передан",
                debug: { receivedBody: bodyText }
            }, { status: 400 });
        }

        // ... остальной код без изменений
        const magic = await prisma.magicToken.findUnique({
            where: { token }
        });

        if (!magic) {
            return NextResponse.json({ success: false, error: "Токен не найден" }, { status: 400 });
        }

        if (magic.used || magic.expiresAt < new Date()) {
            return NextResponse.json({ success: false, error: "Ссылка истекла или уже использована" }, { status: 400 });
        }

        let user = await prisma.user.findUnique({
            where: { telegramId: magic.telegramId }
        });

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

    } catch (error: any) {
        console.error("💥 Ошибка в verify-magic:", error);
        return NextResponse.json({
            success: false,
            error: "Внутренняя ошибка сервера",
            debug: error.message
        }, { status: 500 });
    }
}