import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createServerClientFn } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const { telegramUser } = await request.json();

        if (!telegramUser?.id) {
            return NextResponse.json({ success: false, error: "Нет telegram_id" }, { status: 400 });
        }

        const supabase = await createServerClientFn();

        const adminSupabase = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Ищем пользователя по telegram_id
        let { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('telegram_id', telegramUser.id)
            .single();

        let userId = existingProfile?.id;

        if (!userId) {
            // Создаём в auth.users
            const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
                email: `${telegramUser.id}@telegram.local`,
                email_confirm: true,
                user_metadata: {
                    telegram_id: telegramUser.id,
                    first_name: telegramUser.first_name,
                    last_name: telegramUser.last_name,
                    username: telegramUser.username,
                    avatar_url: telegramUser.photo_url,
                    provider: 'telegram'
                }
            });

            if (authError) throw authError;
            userId = authUser.user.id;

            // Создаём профиль
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: userId,
                    telegram_id: telegramUser.id,
                    name: telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : ''),
                    username: telegramUser.username,
                    avatar_url: telegramUser.photo_url,
                    email: `${telegramUser.id}@telegram.local`
                });

            if (profileError) throw profileError;
        }

        return NextResponse.json({
            success: true,
            userId: userId,
            message: "Успешная авторизация через Telegram"
        });

    } catch (error: any) {
        console.error("Telegram auth error:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}