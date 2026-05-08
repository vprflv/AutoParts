import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        const { telegramUser } = await request.json();

        console.log("📥 Получено от бота:", telegramUser);

        if (!telegramUser?.id) {
            return NextResponse.json({ success: false, error: "Нет telegram_id" }, { status: 400 });
        }

        const admin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        let { data: { users } } = await admin.auth.admin.listUsers();
        let authUser = users.find((u: any) => u.user_metadata?.telegram_id === telegramUser.id);

        if (!authUser) {
            console.log(`🆕 Создаём НОВОГО пользователя ${telegramUser.id}`);

            const { data: newUser, error } = await admin.auth.admin.createUser({
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


            await admin.from('profiles').insert({
                id: authUser.id,
                telegram_id: telegramUser.id,
                name: telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : ''),
                username: telegramUser.username,
                avatar_url: telegramUser.photo_url,
                email: `${telegramUser.id}@telegram.local`
            });

            console.log("✅ Пользователь + профиль успешно созданы");
        } else {
            console.log("🔄 Пользователь уже существует");
        }

        const magicLink = `https://auto-parts-beige.vercel.app/auth/telegram?userId=${authUser.id}`;

        return NextResponse.json({
            success: true,
            userId: authUser.id,
            magicLink
        });

    } catch (error: any) {
        console.error("💥 Критическая ошибка в route:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}