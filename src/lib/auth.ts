import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/src/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET || JWT_SECRET === 'super-secret-key-change-in-production') {
    console.warn('⚠️ JWT_SECRET не настроен! Используется слабый ключ для разработки.');
}

export async function getCurrentUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) return null;

    try {
        const decoded = verify(sessionToken, JWT_SECRET) as { userId: string };
        return decoded.userId;
    } catch (err) {
        console.error('JWT verification failed:', err);
        return null;
    }
}

/**
 * Получить полную информацию о текущем пользователе
 */
export async function getCurrentUser() {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            username: true,
            avatarUrl: true,
            telegramId: true,
            provider: true,
            createdAt: true,
        }
    });
}