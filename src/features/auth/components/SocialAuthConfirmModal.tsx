// src/features/auth/components/SocialAuthConfirmModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface SocialAuthConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    provider: string;
    onConfirm: () => void;
}

export default function SocialAuthConfirmModal({
                                                   isOpen,
                                                   onClose,
                                                   provider,
                                                   onConfirm,
                                               }: SocialAuthConfirmModalProps) {
    const [agreed, setAgreed] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-md border border-zinc-700">
                <div className="flex items-center justify-between border-b border-zinc-700 px-6 py-5">
                    <h2 className="text-xl font-semibold">Подтверждение</h2>
                    <button onClick={onClose}>
                        <X size={24} className="text-zinc-400 hover:text-white" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <p className="text-zinc-300">
                        Для регистрации через <span className="font-medium text-white">{provider}</span> нам
                        потребуется доступ к вашему email и имени.
                    </p>

                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            id="social-policy"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="mt-1 w-5 h-5 accent-blue-600 bg-zinc-800 border-zinc-700 rounded"
                        />
                        <label htmlFor="social-policy" className="text-sm text-zinc-400 leading-relaxed cursor-pointer">
                            Я соглашаюсь с{" "}
                            <a href="/privacy" className="text-blue-500 hover:underline">Политикой конфиденциальности</a>
                            {" "}и{" "}
                            <a href="/terms" className="text-blue-500 hover:underline">Условиями использования</a>
                        </label>
                    </div>

                    <button
                        onClick={onConfirm}
                        disabled={!agreed}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed py-4 rounded-2xl font-medium transition-all"
                    >
                        Продолжить через {provider}
                    </button>

                    <p className="text-xs text-center text-zinc-500">
                        Вы можете отозвать согласие в настройках аккаунта в любое время
                    </p>
                </div>
            </div>
        </div>
    );
}