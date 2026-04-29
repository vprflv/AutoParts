
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

import AuthTabs from "./AuthTabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useAuthStore } from "@/src/store/useAuthStore";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [tab, setTab] = useState<"login" | "register" | "forgot">("login");
    const { user, logout } = useAuthStore();

    useEffect(() => {
        if (!isOpen) {
            setTab("login");
        }
    }, [isOpen]);

    // Если пользователь уже авторизован — показываем кнопку выхода
    if (user && isOpen) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
                <div className="bg-zinc-900 rounded-3xl w-full max-w-md p-8 text-center">
                    <p className="text-xl mb-6">Привет, {user.name || "Пользователь"}!</p>
                    <button
                        onClick={async () => {
                            await logout();
                            onClose();
                        }}
                        className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-2xl font-medium transition-colors"
                    >
                        Выйти из аккаунта
                    </button>
                </div>
            </div>
        );
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 sm:p-6">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-md mx-auto overflow-hidden max-h-[95vh] flex flex-col">
                {/* Заголовок */}
                <div className="flex items-center justify-between px-5 sm:px-6 pt-6 pb-4 border-b border-zinc-800 flex-shrink-0">
                    <h2 className="text-2xl font-semibold">
                        {tab === "forgot" ? "Восстановление пароля" : "Авторизация"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white p-3 -mr-2 transition-colors active:scale-90"
                    >
                        <X size={28} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 py-6">
                    {tab === "forgot" ? (
                        <ForgotPasswordForm onClose={onClose} setTab={setTab} />
                    ) : (
                        <>
                            <AuthTabs tab={tab} setTab={setTab} />
                            {tab === "login" ? (
                                <LoginForm onClose={onClose} setTab={setTab} />
                            ) : (
                                <RegisterForm onClose={onClose} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}