// app/api/auth/verify-telegram/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    console.log('🔐 [Verify Telegram] === ЗАПРОС ДОШЁЛ ДО РОУТА ===');
    console.log('Headers:', Object.fromEntries(request.headers));

    try {
        const body = await request.json();
        console.log('Тело запроса:', body);

        return NextResponse.json({
            success: true,
            message: "Маршрут работает! Токен получен",
            receivedToken: body.token ? "Да" : "Нет"
        });
    } catch (e) {
        console.error('Ошибка чтения тела:', e);
        return NextResponse.json({ success: false, error: "Ошибка чтения тела" }, { status: 400 });
    }
}