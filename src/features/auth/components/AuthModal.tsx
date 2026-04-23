// src/features/auth/components/AuthModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuthStore } from "@/src/store/useAuthStore";

import AuthTabs from "./AuthTabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [tab, setTab] = useState<"login" | "register">("login");
    const { user, logout } = useAuthStore();

    useEffect(() => {
        if (!isOpen) {
            setTab("login");
        }
    }, [isOpen]);

    if (user) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
                <div className="bg-zinc-900 rounded-3xl w-full max-w-md mx-auto p-8 text-center">
                    <p className="text-xl mb-6">Привет, {user.name}!</p>
                    <button
                        onClick={() => { logout(); onClose(); }}
                        className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-2xl font-medium transition-colors"
                    >
                        Выйти
                    </button>
                </div>
            </div>
        );
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 sm:p-6">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-md mx-auto overflow-hidden">
                {/* Заголовок */}
                <div className="flex items-center justify-between px-5 sm:px-6 pt-6 pb-4 border-b border-zinc-800">
                    <h2 className="text-2xl font-semibold">Авторизация</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white p-2 transition-colors"
                    >
                        <X size={28} />
                    </button>
                </div>

                <div className="p-5 sm:p-6 space-y-6">
                    <AuthTabs tab={tab} setTab={setTab} />

                    {tab === "login" ? (
                        <LoginForm onClose={onClose} />
                    ) : (
                        <RegisterForm onClose={onClose} />
                    )}
                </div>
            </div>
        </div>
    );
}