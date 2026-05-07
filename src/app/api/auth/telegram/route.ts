import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        const { telegramUser } = await request.json();

        if (!telegramUser?.id) {
            return NextResponse.json({ success: false, error: "Нет telegram_id" }, { status: 400 });
        }

        const adminSupabase = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Поиск пользователя
        let { data: { users } } = await adminSupabase.auth.admin.listUsers();
        let authUser = users.find((u: any) => u.user_metadata?.telegram_id === telegramUser.id);

        // Если пользователя нет — создаём
        if (!authUser) {
            console.log(`Создаём нового пользователя Telegram ID: ${telegramUser.id}`);

            const { data: newUser, error } = await adminSupabase.auth.admin.createUser({
                email: `${telegramUser.id}@telegram.local`,
                email_confirm: true,
                user_metadata: {
                    telegram_id: telegramUser.id,
                    first_name: telegramUser.first_name,
                    last_name: telegramUser.last_name || null,
                    username: telegramUser.username || null,
                    avatar_url: telegramUser.photo_url || null,
                    provider: 'telegram'
                }
            });

            if (error) {
                console.error("Ошибка createUser:", error);
                throw error;
            }

            authUser = newUser.user;

            // Создаём профиль
            const { error: profileError } = await adminSupabase
                .from('profiles')
                .insert({
                    id: authUser.id,
                    telegram_id: telegramUser.id,
                    name: telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : ''),
                    username: telegramUser.username,
                    avatar_url: telegramUser.photo_url,
                    email: `${telegramUser.id}@telegram.local`
                });

            if (profileError) console.error("Ошибка создания профиля:", profileError);
        }

        return NextResponse.json({
            success: true,
            userId: authUser.id,
            message: "Пользователь обработан"
        });

    } catch (error: any) {
        console.error("❌ Ошибка в /api/auth/telegram:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}