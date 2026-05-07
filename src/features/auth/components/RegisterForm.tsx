"use client";

import { useState } from "react";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";

interface RegisterFormProps {
    onClose: () => void;
}

export default function RegisterForm({ onClose }: RegisterFormProps) {
    const [isTelegramWidgetOpen, setIsTelegramWidgetOpen] = useState(false);

    // Подключаем polling
    useTelegramAuth(isTelegramWidgetOpen, onClose);

    const openTelegram = () => {
        window.open("https://t.me/AutoPartLoginBot?start=login", "_blank");
        setIsTelegramWidgetOpen(true);
    };

    return (
        <div className="space-y-6 p-6">
            <h2 className="text-2xl font-bold">Регистрация</h2>

            <button
                onClick={openTelegram}
                className="w-full bg-[#229ED9] hover:bg-[#1e7ac0] text-white py-4 rounded-2xl text-lg font-medium"
            >
                Войти через Telegram
            </button>

            {isTelegramWidgetOpen && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
                    <div className="bg-zinc-900 p-8 rounded-3xl max-w-sm w-full text-center">
                        <h3 className="text-xl mb-4">Ожидаем вход через Telegram</h3>
                        <p className="mb-2">Напишите <strong>/start</strong> боту</p>
                        <p className="text-sm text-zinc-400">Автоматическая проверка...</p>

                        <button
                            onClick={() => setIsTelegramWidgetOpen(false)}
                            className="mt-6 text-zinc-400 hover:text-white"
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}