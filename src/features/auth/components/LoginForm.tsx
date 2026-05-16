"use client";

import {useEffect, useState} from "react";
import { Eye, EyeOff } from "lucide-react";
import SocialLoginButtons from "@/src/features/auth/components/SocialLoginButtons";

import TelegramModal from "@/features/auth/components/telegram/TelegramModal";
import {useLoginForm} from "@/features/auth/hooks/useLoginForm";
import {toast} from "react-hot-toast";


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
        generalError
    } = useLoginForm();

    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isTelegramWidgetOpen, setIsTelegramWidgetOpen] = useState(false);


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
        if (provider === "telegram") {
            setIsTelegramWidgetOpen(true);
        } else {
            toast.error(`🔄 Вход через ${provider} будет реализован позже`);
        }
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
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 text-base md:text-lg transition-all"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1.5 px-1">{errors.email}</p>
                )}
            </div>

            {/* Пароль */}
            <div>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => validateField("password")}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 text-base md:text-lg transition-all pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1.5 px-1">{errors.password}</p>
                )}
            </div>
            {/* Общая ошибка */}
            {generalError && (
                <p className="text-red-500 text-sm text-center bg-red-500/10 border border-red-500/30 py-2.5 rounded-2xl">
                    {generalError}
                </p>
            )}

            <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5 h-5 accent-cyan-500 bg-zinc-800 border-zinc-700 rounded focus:ring-cyan-400"
                    />
                    <span className="text-sm md:text-base text-zinc-400">
                        Запомнить меня
                    </span>
                </label>

                <button
                    type="button"
                    onClick={() => setTab("forgot")}
                    className="text-cyan-400 hover:text-cyan-300 text-sm md:text-base transition-colors"
                >
                    Забыл пароль?
                </button>
            </div>



            {/* Кнопка входа */}
            <button
                onClick={onFormSubmit}
                disabled={isLoading}
                className="btn-neon disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isLoading ? "Подождите..." : "Войти"}
            </button>

            <SocialLoginButtons onSocialClick={handleSocialLogin} />

            {/* Telegram Widget Modal */}
            {isTelegramWidgetOpen && (
                <TelegramModal
                    isOpen={isTelegramWidgetOpen}
                    onClose={() => setIsTelegramWidgetOpen(false)}
                />
            )}
        </div>
    );
}