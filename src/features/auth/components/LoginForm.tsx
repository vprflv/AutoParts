// src/features/auth/components/LoginForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthForm } from "@/src/features/auth/hooks/useAuthForm";
import SocialLoginButtons from "@/src/features/auth/components/SocialLoginButtons";

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
    const [showPassword, setShowPassword] = useState(false);

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
            if (rememberMe) localStorage.setItem("rememberedEmail", email);
            else localStorage.removeItem("rememberedEmail");
            onClose();
        }
    };

    const handleSocialLogin = (provider: string) => {
        alert(`🔄 Вход через ${provider} будет реализован позже`);
    };

    return (
        <div className="space-y-6">
            {/* Email */}
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => validateField("email")}
                    className={`w-full bg-zinc-800 border ${
                        errors.email ? "border-red-500" : "border-zinc-700"
                    } rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base md:text-lg transition-all`}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1.5 px-1">
                        {errors.email}
                    </p>
                )}
            </div>

            {/* Пароль с кнопкой "глаз" */}
            <div>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => validateField("password")}
                        className={`w-full bg-zinc-800 border ${
                            errors.password ? "border-red-500" : "border-zinc-700"
                        } rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base md:text-lg transition-all pr-12`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1.5 px-1">{errors.password}</p>
                )}
            </div>

            <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5 h-5 accent-blue-600 bg-zinc-800 border-zinc-700 rounded"
                    />
                    <span className="text-sm md:text-base text-zinc-400">
                        Запомнить меня
                    </span>
                </label>

                <button
                    type="button"
                    onClick={() => setTab("forgot")}
                    className="text-blue-500 hover:text-blue-400 text-sm md:text-base transition-colors"
                >
                    Забыл пароль?
                </button>
            </div>

            <button
                onClick={onFormSubmit}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 py-4 rounded-2xl font-medium text-lg md:text-xl transition-all active:scale-[0.985]"
            >
                {isLoading ? "Подождите..." : "Войти"}
            </button>

            <SocialLoginButtons onSocialClick={handleSocialLogin} />
        </div>
    );
}