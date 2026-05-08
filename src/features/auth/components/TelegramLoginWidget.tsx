"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        Telegram?: {
            WebApp: any;
        };
    }
}


interface Props {
    botUsername: string;
    onAuth?: (user: any) => void;
}

export default function TelegramLoginWidget({ botUsername, onAuth }: Props) {

    useEffect(() => {
        const tg = window.Telegram?.WebApp;

        if (tg) {
            console.log("✅ Telegram WebApp detected");
            tg.ready();
            tg.expand();

            if (tg.initDataUnsafe?.user) {
                onAuth?.(tg.initDataUnsafe.user);
            }
        } else {
            console.log("ℹ️ Обычный браузер");
        }
    }, [onAuth]);

    const openBot = () => {
        const bot = botUsername.replace("@", "");
        window.open(`https://t.me/${bot}?start=login`, "_blank");
    };

    return (
        <div className="text-center py-8">
            <button
                onClick={openBot}
                className="bg-[#229ED9] hover:bg-[#1e7ac0] text-white px-10 py-4 rounded-2xl font-medium text-lg flex items-center gap-3 mx-auto transition-all active:scale-95 shadow-lg"
            >
                Войти через Telegram
            </button>
            <p className="text-xs text-gray-500 mt-3">
                Откроется чат с ботом @AutoPartLoginBot
            </p>
        </div>
    );
}