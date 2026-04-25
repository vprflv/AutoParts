// src/features/auth/components/LoginForm.tsx
"use client";

import { useAuthForm } from "@/src/features/auth/hooks/useAuthForm";
import { useState, useEffect } from "react";

interface LoginFormProps {
    onClose: () => void;
    setTab: (tab: "login" | "register" | "forgot") => void;
}

export default function LoginForm({ onClose, setTab }: LoginFormProps) {
    const {
        email,
        setEmail,
        password,
        setPassword,
        errors,
        isLoading,
        handleSubmit,
        validateField,
    } = useAuthForm();

    const [rememberMe, setRememberMe] = useState(false);

    // Автозаполнение сохранённого email
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, [setEmail]);

    const onFormSubmit = async () => {
        const success = await handleSubmit();

        if (success) {
            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }
            onClose();
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => validateField("email")}
                    className={`w-full bg-zinc-800 border ${errors.email ? 'border-red-500' : 'border-zinc-700'} rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>}
            </div>

            <div>
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => validateField("password")}
                    className={`w-full bg-zinc-800 border ${errors.password ? 'border-red-500' : 'border-zinc-700'} rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base`}
                />
            </div>

            <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 accent-blue-600 bg-zinc-800 border-zinc-700 rounded"
                    />
                    <span className="text-sm text-zinc-400">Запомнить меня</span>
                </label>

                <button
                    type="button"
                    onClick={() => setTab("forgot")}
                    className="text-blue-500 hover:text-blue-400 text-sm transition-colors"
                >
                    Забыл пароль?
                </button>
            </div>

            <button
                onClick={onFormSubmit}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 py-4 rounded-2xl font-medium text-lg transition-all"
            >
                {isLoading ? "Подождите..." : "Войти"}
            </button>
        </div>
    );
}