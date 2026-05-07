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

        // Поиск или создание пользователя
        let { data: { users } } = await adminSupabase.auth.admin.listUsers();
        let authUser = users.find((u: any) => u.user_metadata?.telegram_id === telegramUser.id);

        if (!authUser) {
            const { data: newUser, error } = await adminSupabase.auth.admin.createUser({
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

            if (error) throw error;
            authUser = newUser.user;
        }

        // Возвращаем данные для установки сессии
        return NextResponse.json({
            success: true,
            userId: authUser.id,
            user: authUser,
            // Можно добавить токены позже, пока хотя бы userId
        });

    } catch (error: any) {
        console.error("Telegram route error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}