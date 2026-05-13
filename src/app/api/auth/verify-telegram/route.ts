// app/api/auth/verify-telegram/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET!;

export async function POST(request: NextRequest) {
    console.log('🔐 [Verify Telegram] Запрос обработан');

    try {
        const body = await request.json();
        console.log('📦 Получено тело:', body);

        const { token } = body;
        if (!token) {
            return NextResponse.json({ success: false, error: "Токен не передан" }, { status: 400 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        console.log('🔑 Токен декодирован, userId:', decoded.userId);

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
            console.error(`❌ Профиль НЕ найден для userid: ${decoded.userId}`);
            console.error('Ошибка Supabase:', error);
            return NextResponse.json({
                success: false,
                error: "Профиль не найден",
                userid: decoded.userId
            }, { status: 404 });
        }

        console.log(`✅ ПРОФИЛЬ НАЙДЕН:`, profile);

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
        console.error('💥 Критическая ошибка в verify-telegram:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}