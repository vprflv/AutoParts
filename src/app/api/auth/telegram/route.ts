// app/api/auth/telegram/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET!;

export async function POST(request: NextRequest) {
    console.log('🔄 [Telegram Auth] Получен запрос от бота');

    try {
        const { telegramUser } = await request.json();

        if (!telegramUser?.id) {
            console.log('❌ Нет telegram_id в запросе');
            return NextResponse.json({ success: false, error: "Нет telegram_id" }, { status: 400 });
        }

        const admin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Поиск или создание пользователя
        const { data: { users } } = await admin.auth.admin.listUsers();
        let authUser = users?.find((u: any) => u.user_metadata?.telegram_id === telegramUser.id);

        if (!authUser) {
            console.log(`🆕 Создаём нового пользователя (telegram_id: ${telegramUser.id})`);

            const { data: newUser, error: createError } = await admin.auth.admin.createUser({
                email: `${telegramUser.id}@telegram.local`,
                email_confirm: true,
                user_metadata: {
                    telegram_id: telegramUser.id,
                    first_name: telegramUser.first_name,
                    last_name: telegramUser.last_name || null,
                    username: telegramUser.username,
                    avatar_url: telegramUser.photo_url,
                    provider: 'telegram'
                }
            });

            if (createError) throw createError;
            authUser = newUser.user;

            // Создаём профиль
            await admin.from('profiles').insert({
                id: authUser.id,
                telegram_id: telegramUser.id,
                name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
                username: telegramUser.username,
                avatar_url: telegramUser.photo_url,
            });
        } else {
            console.log(`🔄 Обновляем данные пользователя ${authUser.id}`);
            await admin.from('profiles').update({
                name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
                username: telegramUser.username,
                avatar_url: telegramUser.photo_url,
            }).eq('id', authUser.id);
        }

        // 2. Создаём JWT токен (живёт 5 минут)
        const token = jwt.sign(
            { userId: authUser.id },
            JWT_SECRET,
            { expiresIn: '5m' }
        );

        const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
        const magicLink = `${siteUrl}/auth/telegram?token=${token}`;

        console.log('✅ JWT токен создан успешно');
        console.log('🔗 Magic Link:', magicLink);

        return NextResponse.json({
            success: true,
            magicLink
        });

    } catch (error: any) {
        console.error('💥 Ошибка в /api/auth/telegram:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}