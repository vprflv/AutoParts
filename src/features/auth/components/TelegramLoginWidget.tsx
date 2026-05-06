"use client";

import { useEffect } from "react";


declare global {
    interface Window {
        Telegram?: {
            WebApp: any;
        };
    }
}

interface TelegramLoginWidgetProps {
    botUsername: string;
    onAuth: (user: any) => void;
}

export default function TelegramLoginWidget({ botUsername, onAuth }: TelegramLoginWidgetProps) {
    useEffect(() => {
        console.log("🔍 TelegramLoginWidget mounted");

        // Пытаемся получить данные из URL (Telegram иногда передаёт их в query)
        const urlParams = new URLSearchParams(window.location.search);
        const initData = urlParams.get('initData') || window.Telegram?.WebApp?.initData;

        if (initData) {
            try {
                const userData = JSON.parse(decodeURIComponent(initData));
                console.log("✅ Данные из URL:", userData);
                if (userData.user) onAuth(userData.user);
            } catch (e) {
                console.log("Не удалось распарсить initData");
            }
        }

        // Основная проверка
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            console.log("✅ Telegram WebApp найден!");
            console.log("User:", tg.initDataUnsafe?.user);
            if (tg.initDataUnsafe?.user) {
                onAuth(tg.initDataUnsafe.user);
            }
        } else {
            console.log("❌ Telegram.WebApp не обнаружен");
        }
    }, [onAuth]);

    const openTelegramLogin = () => {
        const bot = botUsername.replace("@", "");
        const url = `https://t.me/${bot}?start=login`;
        window.open(url, "_blank");
    };

    return (
        <div className="text-center py-8">
            <button
                onClick={openTelegramLogin}
                className="bg-[#229ED9] hover:bg-[#1e7ac0] text-white px-10 py-4 rounded-2xl font-medium text-lg flex items-center gap-3 mx-auto transition-all active:scale-95 shadow-lg"
            >
                Войти через Telegram
            </button>
            <p className="text-xs text-zinc-500 mt-4">
                Откроется бот → нажми кнопку "Войти на сайте"
            </p>
        </div>
    );
}