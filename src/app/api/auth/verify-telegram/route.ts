// app/api/auth/verify-telegram/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET!;

export async function POST(request: NextRequest) {
    console.log('🔐 [Verify Telegram] Запрос получен');

    try {
        // Более надёжное чтение тела
        let body;
        try {
            body = await request.json();
            console.log('📦 Получено тело запроса:', body);
        } catch (e) {
            console.error('❌ Не удалось распарсить JSON тело');
            return NextResponse.json({
                success: false,
                error: "Неверный формат запроса"
            }, { status: 400 });
        }

        const { token } = body;

        if (!token) {
            console.error('❌ Token отсутствует в теле запроса');
            return NextResponse.json({
                success: false,
                error: "Токен не передан"
            }, { status: 400 });
        }

        console.log('🔑 Токен получен, проверяем...');

        // Верификация токена
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        const admin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: profile, error } = await admin
            .from('profiles')
            .select('*')
            .eq('userid', decoded.userId)
            .single();

        if (error || !profile) {
            console.error(`❌ Профиль не найден для userid: ${decoded.userId}`);
            return NextResponse.json({
                success: false,
                error: "Профиль не найден"
            }, { status: 404 });
        }

        console.log(`✅ Профиль найден: ${profile.name || profile.userid}`);

        return NextResponse.json({
            success: true,
            profile: {
                id: profile.userid,
                name: profile.name,
                username: profile.username,
                avatar_url: profile.avatar_url,
            }
        });

    } catch (error: any) {
        console.error('💥 Ошибка verify-telegram:', error);

        if (error.name === 'TokenExpiredError') {
            return NextResponse.json({ success: false, error: "Ссылка устарела" }, { status: 401 });
        }

        return NextResponse.json({
            success: false,
            error: "Недействительный токен"
        }, { status: 401 });
    }
}