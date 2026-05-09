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
    const { user } = useAuthStore();

    useEffect(() => {
        if (!isOpen) {
            setTab("login");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 sm:p-6">
            <div
                className="bg-zinc-900 rounded-3xl w-full max-w-md mx-auto overflow-hidden max-h-[95vh] flex flex-col border border-zinc-700 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center text-cyan-300 justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-950 flex-shrink-0">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {tab === "forgot" ? "Восстановление пароля" : "Авторизация"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white p-3 -mr-2 transition-all hover:scale-110"
                    >
                        <X size={28}  className={"text-cyan-300 hover:text-blue-500"} />
                    </button>
                </div>

                {/* Основной контент */}
                <div className="flex-1 overflow-y-auto custom-scroll-purple p-6 md:p-7">
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