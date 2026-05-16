// src/features/auth/components/TelegramLoginWidget.tsx
"use client";

interface Props {
    botUsername?: string;
}

export default function TelegramLoginWidget({ botUsername = "AutoPartLoginBot" }: Props) {

    const openBot = () => {
        const bot = botUsername.replace("@", "");
        window.open(`https://t.me/${bot}?start=login`, "_blank");
    };

    return (
        <button
            onClick={openBot}
            className="w-full bg-[#229ED9] hover:bg-[#1e7ac0] text-white py-4 rounded-2xl font-medium text-lg transition-all active:scale-95"
        >
            Войти через Telegram
        </button>
    );
}