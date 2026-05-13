// bot.js
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch').default;

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const API_URL = "https://auto-parts-beige.vercel.app/api/auth/magic";

console.log("✅ Бот запущен");
console.log("📡 API_URL:", API_URL);

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const user = msg.from;

    console.log(`📨 /start от ${user.id} (${user.first_name} ${user.last_name || ''})`);

    if (!user?.id) {
        console.error("❌ Не удалось получить user.id");
        bot.sendMessage(chatId, "❌ Не удалось получить данные от Telegram.");
        return;
    }

    bot.sendMessage(chatId, `Привет, ${user.first_name}! Генерируем ссылку...`);

    try {
        const payload = {
            telegramId: String(user.id),
            name: `${user.first_name} ${user.last_name || ''}`.trim(),
            username: user.username,
            avatarUrl: user.photo_url,
        };

        console.log("📤 Отправляем payload:", payload);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log(`⬅️ Ответ от сервера: ${response.status} ${response.statusText}`);

        const text = await response.text();
        console.log("📄 Ответ (первые 500 символов):", text.substring(0, 500));

        let result;
        try {
            result = JSON.parse(text);
        } catch (e) {
            throw new Error(`Сервер вернул не JSON: ${text.substring(0, 200)}`);
        }

        console.log("✅ Распарсенный результат:", result);

        if (result.success && result.magicLink) {
            await bot.sendMessage(chatId,
                `✅ Ссылка готова!\n\nНажми кнопку для входа:`,
                {
                    reply_markup: {
                        inline_keyboard: [[{
                            text: "🚀 Войти в AutoPart",
                            url: result.magicLink
                        }]]
                    }
                }
            );
        } else {
            await bot.sendMessage(chatId, `❌ Ошибка: ${result.error || 'Неизвестная ошибка'}`);
        }

    } catch (error) {
        console.error("💥 Полная ошибка:", error);
        bot.sendMessage(chatId, "❌ Не удалось связаться с сайтом.\nПопробуй позже.");
    }
});

console.log("🤖 Бот готов. Напиши /start");