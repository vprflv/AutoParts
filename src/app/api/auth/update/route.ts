// app/api/auth/update/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getCurrentUserId } from '@/src/lib/auth';   // твоя функция

export async function PATCH(request: Request) {
    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
        }

        const body = await request.json();

        // Обновляем только разрешённые поля
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: body.name,
                phone: body.phone,
                username: body.username,

            },
            select: {
                id: true,
                email: true,
                name: true,
                username: true,
                avatarUrl: true,
                phone: true,
                provider: true,
                telegramId: true,
            }
        });

        return NextResponse.json({
            success: true,
            user: updatedUser
        });

    } catch (error: any) {
        console.error("Update user error:", error);
        return NextResponse.json(
            { error: error.message || "Не удалось обновить профиль" },
            { status: 500 }
        );
    }
}