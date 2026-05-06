"use client";

import { useEffect } from "react";

interface TelegramLoginWidgetProps {
    botUsername: string;
    onAuth: (user: any) => void;
}

export default function TelegramLoginWidget({ botUsername, onAuth }: TelegramLoginWidgetProps) {
    const sendLog = (message: string, type = 'info') => {
        fetch('/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, type }),
        }).catch(() => {}); // не ждём ответа
    };

    useEffect(() => {
        sendLog("TelegramLoginWidget mounted");

        if (window.Telegram?.WebApp) {
            debugger
            const tg = window.Telegram.WebApp;
            sendLog("Telegram WebApp detected!", "success");

            tg.ready();
            tg.expand();

            if (tg.initDataUnsafe?.user) {
                sendLog(`User data received: ${tg.initDataUnsafe.user.first_name} (id: ${tg.initDataUnsafe.user.id})`, "success");
                onAuth(tg.initDataUnsafe.user);
            }
        } else {
            sendLog("Telegram.WebApp not found", "error");
        }
    }, [onAuth]);

    const openTelegramLogin = () => {
        const bot = botUsername.replace("@", "");
        window.open(`https://t.me/${bot}?start=login`, "_blank");
    };

    return (
        <div className="text-center py-8">
            <button
                onClick={openTelegramLogin}
                className="bg-[#229ED9] hover:bg-[#1e7ac0] text-white px-10 py-4 rounded-2xl font-medium text-lg flex items-center gap-3 mx-auto transition-all active:scale-95 shadow-lg"
            >
                Войти через Telegram
            </button>
        </div>
    );
}