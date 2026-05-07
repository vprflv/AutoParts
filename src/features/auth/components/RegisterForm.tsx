"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

interface RegisterFormProps {
    onClose: () => void;
}

export default function RegisterForm({ onClose }: RegisterFormProps) {
    const [isTelegramWidgetOpen, setIsTelegramWidgetOpen] = useState(false);

    // Открываем бота
    const openTelegram = () => {
        window.open("https://t.me/AutoPartLoginBot?start=login", "_blank");
        setIsTelegramWidgetOpen(true);
    };

    // Polling — проверяем каждые 2 секунды
    useEffect(() => {
        if (!isTelegramWidgetOpen) return;

        const interval = setInterval(async () => {
            console.log("🔍 Проверка пользователя...");

            await useAuthStore.getState().loadUser();           // пробуем нормальную загрузку
            const user = useAuthStore.getState().user;

            if (user) {
                console.log("🎉 ПОЛЬЗОВАТЕЛЬ НАЙДЕН!", user);
                toast.success("✅ Вы успешно вошли через Telegram!");
                setIsTelegramWidgetOpen(false);
                onClose();
                clearInterval(interval);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [isTelegramWidgetOpen, onClose]);

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
                        <h3 className="text-xl mb-4">Ожидаем вход...</h3>
                        <p>Напишите <strong>/start</strong> боту @AutoPartLoginBot</p>
                        <p className="text-sm text-zinc-400 mt-4">Автопроверка каждые 2 секунды</p>

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