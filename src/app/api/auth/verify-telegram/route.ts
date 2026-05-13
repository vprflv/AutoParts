// app/api/auth/telegram/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET!;

export async function POST(request: NextRequest) {
    console.log('🔄 [Telegram Auth] === НАЧАЛО ЗАПРОСА ===');

    try {
        const { telegramUser } = await request.json();
        console.log('📥 Получены данные от бота:', telegramUser);

        if (!telegramUser?.id) {
            return NextResponse.json({ success: false, error: "Нет данных пользователя" }, { status: 400 });
        }

        const telegramId = String(telegramUser.id);
        const email = `${telegramId}@telegram.local`;

        const admin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Создание пользователя
        const { data: { users } } = await admin.auth.admin.listUsers();
        let authUser = users?.find((u: any) =>
            u.user_metadata?.telegram_id === telegramId || u.email === email
        );

        if (!authUser) {
            console.log(`🆕 Создаём пользователя в auth.users`);
            const { data: newUser, error: createError } = await admin.auth.admin.createUser({
                email,
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
                console.error("❌ Ошибка createUser:", createError);
                throw createError;
            }
            authUser = newUser.user;
            console.log(`✅ Пользователь создан в auth.users: ${authUser.id}`);
        } else {
            console.log(`✅ Пользователь уже существует: ${authUser.id}`);
        }

        // === КРИТИЧНЫЙ БЛОК — создание профиля ===
        console.log(`📝 Пытаемся upsert профиля для userid = ${authUser.id}`);

        const profilePayload = {
            userid: authUser.id,
            email: authUser.email,
            name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
            username: telegramUser.username || null,
            avatar_url: telegramUser.photo_url || null,
        };

        console.log('📤 Payload для profiles:', profilePayload);

        const { data: profile, error: upsertError } = await admin
            .from('profiles')
            .upsert(profilePayload, { onConflict: 'userid' })
            .select()
            .single();

        if (upsertError) {
            console.error("❌ ОШИБКА upsert профиля:", upsertError);
            console.error("Код ошибки:", upsertError.code);
            console.error("Сообщение:", upsertError.message);
            throw upsertError;
        }

        console.log(`✅ ПРОФИЛЬ УСПЕШНО создан/обновлён!`, profile);

        // Генерация токена
        const token = jwt.sign({ userId: authUser.id }, JWT_SECRET, { expiresIn: '10m' });

        const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
        const magicLink = `${siteUrl}/auth/telegram?token=${token}`;

        console.log('✅ Magic Link создан');

        return NextResponse.json({ success: true, magicLink });

    } catch (error: any) {
        console.error('💥 КРИТИЧЕСКАЯ ОШИБКА В TELEGRAM AUTH:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Внутренняя ошибка'
        }, { status: 500 });
    }
}