// src/lib/auth.ts
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

export async function getCurrentUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) return null;

    try {
        const decoded = verify(sessionToken, JWT_SECRET) as { userId: string };
        return decoded.userId;
    } catch {
        return null;
    }
}

// Для удобства
export async function getCurrentUser() {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    // Можно добавить prisma.user.findUnique если нужно
    return { id: userId };
}