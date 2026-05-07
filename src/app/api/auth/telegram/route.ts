import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        const { telegramUser } = await request.json();

        const admin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Поиск или создание пользователя
        let { data: { users } } = await admin.auth.admin.listUsers();
        let authUser = users.find(u => u.user_metadata?.telegram_id === telegramUser.id);

        if (!authUser) {
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
        }

        // === Генерация токенов (рабочий способ) ===
        const { data: linkData } = await admin.auth.admin.generateLink({
            type: 'magiclink',
            email: authUser.email!,
        });

        const { data: otpData } = await admin.auth.verifyOtp({
            token_hash: linkData.properties!.hashed_token!,
            type: 'magiclink'
        });

        return NextResponse.json({
            success: true,
            userId: authUser.id,
            access_token: otpData.session?.access_token,
            refresh_token: otpData.session?.refresh_token,
        });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}