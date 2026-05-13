// app/api/auth/telegram/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET!;

export async function POST(request: NextRequest) {
    console.log('🔄 [Telegram Auth] Новый запрос');

    try {
        const { telegramUser } = await request.json();

        if (!telegramUser?.id) {
            return NextResponse.json({ success: false, error: "Нет данных пользователя" }, { status: 400 });
        }

        const telegramId = String(telegramUser.id);
        const email = `${telegramId}@telegram.local`;

        const admin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // === 1. Ищем пользователя по telegram_id ===
        const { data: { users } } = await admin.auth.admin.listUsers();
        let authUser = users?.find((u: any) => u.user_metadata?.telegram_id === telegramId);

        // === 2. Если не нашли — создаём ===
        if (!authUser) {
            console.log(`🆕 Создаём нового пользователя (telegram_id: ${telegramId})`);

            const { data: newUser, error: createError } = await admin.auth.admin.createUser({
                email: email,
                email_confirm: true,
                user_metadata: {
                    telegram_id: telegramId,
                    first_name: telegramUser.first_name,
                    last_name: telegramUser.last_name || null,
                    username: telegramUser.username,
                    avatar_url: telegramUser.photo_url,
                    provider: 'telegram'
                }
            });

            if (createError) {
                console.error("Ошибка создания пользователя:", createError.message);
                throw createError;
            }

            authUser = newUser.user;
        } else {
            console.log(`🔄 Пользователь уже существует (id: ${authUser.id})`);
        }

        // === 3. Создаём / обновляем профиль (upsert) ===
        await admin.from('profiles').upsert({
            userid: authUser.id,
            email: authUser.email,
            name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
            username: telegramUser.username,
            avatar_url: telegramUser.photo_url,
        }, { onConflict: 'userid' });

        // === 4. Генерируем токен ===
        const token = jwt.sign(
            { userId: authUser.id },
            JWT_SECRET,
            { expiresIn: '10m' }
        );

        const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
        const magicLink = `${siteUrl}/auth/telegram?token=${token}`;

        console.log(`✅ Magic Link готов для ${telegramUser.first_name}`);

        return NextResponse.json({
            success: true,
            magicLink
        });

    } catch (error: any) {
        console.error('💥 Ошибка Telegram Auth:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Внутренняя ошибка сервера'
        }, { status: 500 });
    }
}