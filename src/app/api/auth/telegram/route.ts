import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { telegramUser } = await request.json();

        // Сохраняем данные последнего успешного входа
        const successData = {
            telegram_id: telegramUser.id,
            first_name: telegramUser.first_name,
            username: telegramUser.username,
            photo_url: telegramUser.photo_url,
            timestamp: new Date().toISOString(),
        };

        // Вариант 1: localStorage через API (простой)
        // Мы можем сохранить в базе или в Redis, но для начала — просто возвращаем
        return NextResponse.json({
            success: true,
            data: successData
        });

    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}