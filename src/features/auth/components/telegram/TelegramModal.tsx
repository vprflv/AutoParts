"use client";

import TelegramLoginWidget from "./TelegramLoginWidget";
import { useAuthStore } from "@/store/useAuthStore";

interface TelegramModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

export default function TelegramModal({
                                          isOpen,
                                          onClose,
                                          title = "Регистрация / Вход через Telegram"
                                      }: TelegramModalProps) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4">
            <div className="bg-zinc-900 rounded-3xl p-8 max-w-sm w-full text-center border border-zinc-700">
                <h3 className="text-xl font-semibold mb-6">{title}</h3>

                <TelegramLoginWidget
                    botUsername="AutoPartLoginBot"
                />

                {/* Простое соглашение */}
                <p className="text-xs text-zinc-500 mt-6 px-4">
                    Нажимая кнопку «Войти через Telegram», вы соглашаетесь с{" "}
                    <span
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => window.open('/policy', '_blank')}
                    >
                            политикой конфиденциальности
                     </span>
                    и обработкой персональных данных
                </p>

                <button
                    onClick={onClose}
                    className="mt-6 text-zinc-400 hover:text-white text-sm"
                >
                    Закрыть
                </button>
            </div>
        </div>
    );
}