import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
    console.log("🚀 [REGISTER] Запрос получен");

    try {
        const { name, email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, error: "Email и пароль обязательны" }, { status: 400 });
        }

        if (!JWT_SECRET) {
            console.error("❌ JWT_SECRET не задан в .env!");
            return NextResponse.json({ success: false, error: "Ошибка сервера (JWT)" }, { status: 500 });
        }

        const existing = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() }
        });

        if (existing) {
            return NextResponse.json({ success: false, error: "Пользователь с таким email уже существует" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase().trim(),
                name: name?.trim() || email.split('@')[0],
                password: hashedPassword,
                provider: "email",
            }
        });

        console.log("✅ Пользователь создан! ID:", user.id);

        // Автоматический вход
        const sessionToken = sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

        (await cookies()).set('session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        });

        console.log("🔑 Сессия успешно установлена");

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                provider: "email"
            }
        });

    } catch (error: any) {
        console.error("💥 Ошибка регистрации:", error);
        return NextResponse.json({
            success: false,
            error: "Внутренняя ошибка сервера"
        }, { status: 500 });
    }
}