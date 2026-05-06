import { NextRequest, NextResponse } from 'next/server';
import { createServerClientFn } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const { telegramUser } = await request.json();

        if (!telegramUser?.id) {
            return NextResponse.json({ success: false, error: "Нет telegram_id" }, { status: 400 });
        }

        const supabase = await createServerClientFn();

        console.log(`Пытаемся сохранить пользователя с telegram_id: ${telegramUser.id}`);

        // Проверяем наличие пользователя
        let { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('telegram_id', telegramUser.id)
            .single();

        // Если нет — создаём
        if (!profile) {
            const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert({
                    telegram_id: telegramUser.id,
                    name: telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : ''),
                    username: telegramUser.username || null,
                    avatar_url: telegramUser.photo_url || null,
                })
                .select()
                .single();

            if (insertError) throw insertError;
            profile = newProfile;
            console.log("Создан новый профиль");
        } else {
            console.log("Профиль уже существует");
        }

        return NextResponse.json({
            success: true,
            profile,
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