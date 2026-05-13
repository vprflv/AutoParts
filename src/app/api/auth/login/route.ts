import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({
                success: false,
                error: "Email и пароль обязательны"
            }, { status: 400 });
        }

        // Ищем пользователя
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !user.password) {
            return NextResponse.json({
                success: false,
                error: "Неверный email или пароль"
            }, { status: 401 });
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({
                success: false,
                error: "Неверный email или пароль"
            }, { status: 401 });
        }

        // Создаём JWT сессию
        const sessionToken = sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Ставим httpOnly куку
        (await cookies()).set('session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 дней
            path: '/',
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                avatarUrl: user.avatarUrl,
                provider: user.provider,
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({
            success: false,
            error: "Внутренняя ошибка сервера"
        }, { status: 500 });
    }
}