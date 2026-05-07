import { NextRequest, NextResponse } from 'next/server';

import { createClient as createAdminClient } from '@supabase/supabase-js';
import {createServerClientFn} from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const { telegramUser } = await request.json();

        if (!telegramUser?.id) {
            return NextResponse.json({ success: false, error: "Нет telegram_id" }, { status: 400 });
        }

        const supabase = await createServerClientFn();

        // === ADMIN CLIENT для создания пользователя в auth.users ===
        const adminSupabase = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY! // ← Service Role Key
        );

        // Ищем, есть ли уже пользователь с таким telegram_id
        let { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('telegram_id', telegramUser.id)
            .single();

        if (!profile) {
            // Создаём пользователя в auth.users
            const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
                email: `${telegramUser.id}@telegram.user`, // временный email
                user_metadata: {
                    telegram_id: telegramUser.id,
                    first_name: telegramUser.first_name,
                    username: telegramUser.username,
                    avatar_url: telegramUser.photo_url,
                },
                email_confirm: true
            });

            if (authError) throw authError;

            // Создаём профиль
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authUser.user.id,
                    telegram_id: telegramUser.id,
                    name: telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : ''),
                    username: telegramUser.username || null,
                    avatar_url: telegramUser.photo_url || null,
                });

            if (profileError) throw profileError;

            profile = { id: authUser.user.id };
        }

        return NextResponse.json({
            success: true,
            userId: profile.id,
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