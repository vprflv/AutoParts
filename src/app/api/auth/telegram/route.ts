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
            console.log('❌ Нет telegram_id');
            return NextResponse.json({ success: false, error: "Нет telegram_id" }, { status: 400 });
        }

        const admin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Поиск пользователя
        const { data: { users } } = await admin.auth.admin.listUsers();
        let authUser = users?.find((u: any) =>
            u.user_metadata?.telegram_id === String(telegramUser.id)
        );

        if (!authUser) {
            console.log(`🆕 Создаём нового Telegram пользователя`);

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

            // === ВАЖНО: используем userid, а не id ===
            const { error: profileError } = await admin
                .from('profiles')
                .insert({
                    userid: authUser.id,
                    email: authUser.email,
                    name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
                    username: telegramUser.username,
                    avatar_url: telegramUser.photo_url,
                });

            if (profileError) {
                console.error("Ошибка создания профиля:", profileError);
                throw profileError;
            }

        } else {
            // Обновление существующего профиля
            await admin
                .from('profiles')
                .update({
                    name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
                    username: telegramUser.username,
                    avatar_url: telegramUser.photo_url,
                    updated_at: new Date().toISOString(),   // если есть такая колонка
                })
                .eq('userid', authUser.id);                 // ← ищем по userid
        }

        // Создаём токен
        const token = jwt.sign(
            { userId: authUser.id },
            JWT_SECRET,
            { expiresIn: '10m' }
        );

        const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
        const magicLink = `${siteUrl}/auth/telegram?token=${token}`;

        console.log('✅ Magic Link успешно создан');

        return NextResponse.json({
            success: true,
            magicLink
        });

    } catch (error: any) {
        console.error('💥 Ошибка в /api/auth/telegram:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Внутренняя ошибка'
        }, { status: 500 });
    }
}