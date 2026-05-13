// app/api/auth/verify-telegram/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET!;

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({
                success: false,
                error: "Токен не передан"
            }, { status: 400 });
        }

        // Верифицируем JWT токен
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        const admin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // === ИЗМЕНЕНО: ищем по userid, а не по id ===
        const { data: profile, error } = await admin
            .from('profiles')
            .select('*')
            .eq('userid', decoded.userId)   // ← Вот главное исправление
            .single();

        if (error || !profile) {
            console.error(`❌ Профиль не найден для userid: ${decoded.userId}`);
            return NextResponse.json({
                success: false,
                error: "Профиль не найден"
            }, { status: 404 });
        }

        console.log(`✅ Токен успешно проверен для пользователя ${profile.name || profile.userid}`);

        return NextResponse.json({
            success: true,
            profile: {
                id: profile.userid,           // возвращаем userid как id для фронта
                name: profile.name,
                username: profile.username,
                avatar_url: profile.avatar_url,
                telegram_id: profile.telegram_id,
            }
        });

    } catch (error: any) {
        console.error('Verify token error:', error);

        if (error.name === 'TokenExpiredError') {
            return NextResponse.json({
                success: false,
                error: "Ссылка устарела. Запроси вход заново."
            }, { status: 401 });
        }

        return NextResponse.json({
            success: false,
            error: "Недействительный токен"
        }, { status: 401 });
    }
}