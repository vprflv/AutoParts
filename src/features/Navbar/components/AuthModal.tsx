"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAuthStore } from "@/src/store/useAuthStore";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [tab, setTab] = useState<"login" | "register">("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login, register, user, logout } = useAuthStore();

    const handleSubmit = () => {
        if (tab === "login") {
            login(email, password);
            onClose();
        } else {
            register(name, email, password);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-md mx-4 overflow-hidden">
                {/* Заголовок */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-800">
                    <h2 className="text-2xl font-semibold">Авторизация</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Табы */}
                <div className="flex border-b border-zinc-800">
                    <button
                        onClick={() => setTab("login")}
                        className={`flex-1 py-4 text-lg font-medium transition-colors ${
                            tab === "login" ? "text-white border-b-2 border-blue-600" : "text-zinc-400"
                        }`}
                    >
                        Вход
                    </button>
                    <button
                        onClick={() => setTab("register")}
                        className={`flex-1 py-4 text-lg font-medium transition-colors ${
                            tab === "register" ? "text-white border-b-2 border-blue-600" : "text-zinc-400"
                        }`}
                    >
                        Регистрация
                    </button>
                </div>

                {/* Форма — главное изменение здесь */}
                <div className="p-6 space-y-5">
                    {tab === "register" && (
                        <input
                            type="text"
                            placeholder="Имя"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="off"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-600"
                        />
                    )}

                    {/* Поле email с защитой */}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="off"           // ← важно
                        name="auth_email"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-600"
                    />

                    {/* Поле пароля с максимальной защитой */}
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"   // ← самое важное изменение!
                        name="auth_password"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-600"
                    />

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-medium text-lg transition-colors mt-4"
                    >
                        {tab === "login" ? "Войти" : "Зарегистрироваться"}
                    </button>
                </div>
            </div>
        </div>
    );
}