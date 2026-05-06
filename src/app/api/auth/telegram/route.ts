import { NextRequest, NextResponse } from 'next/server';
import {createClient} from "@/lib/supabase/client";


export async function POST(request: NextRequest) {
    try {
        const { telegramUser } = await request.json();

        if (!telegramUser?.id) {
            return NextResponse.json({ success: false, error: "Нет telegram_id" }, { status: 400 });
        }

        const supabase = createClient();

        // Ищем пользователя по telegram_id
        let { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('telegram_id', telegramUser.id)
            .single();

        // Если пользователя нет — создаём
        if (!user) {
            const { data: newUser, error } = await supabase
                .from('users')
                .insert({
                    telegram_id: telegramUser.id,
                    name: telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : ''),
                    username: telegramUser.username || null,
                    avatar_url: telegramUser.photo_url || null,
                    // email: null, // можно оставить пустым
                })
                .select()
                .single();

            if (error) throw error;
            user = newUser;
        }

        return NextResponse.json({
            success: true,
            user,
            message: "Успешная авторизация через Telegram"
        });

    } catch (error: any) {
        console.error("Telegram auth error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Внутренняя ошибка"
        }, { status: 500 });
    }
}