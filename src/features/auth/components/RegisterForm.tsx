"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import SocialLoginButtons from "@/src/features/auth/components/SocialLoginButtons";
import { toast } from "react-hot-toast";
import TelegramModal from "@/features/auth/components/telegram/TelegramModal";
import {useRegisterForm} from "@/features/auth/hooks/useRegisterForm";

interface RegisterFormProps {
    onClose: () => void;
}

export default function RegisterForm({ onClose }: RegisterFormProps) {
    const {
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        agreePolicy,
        setAgreePolicy,
        errors,
        isLoading,
        handleSubmit,
        validateField,
        passwordStrength
    } = useRegisterForm();

    const [showPassword, setShowPassword] = useState(false);
    const [isTelegramWidgetOpen, setIsTelegramWidgetOpen] = useState(false);

    const onFormSubmit = async () => {
        const success = await handleSubmit();
        if (success) {
            toast.success("Регистрация прошла успешно! ✅");
            onClose();
        }
    };

    const handleSocialLogin = (provider: string) => {
        if (provider === "telegram") {
            setIsTelegramWidgetOpen(true);
        } else {
            toast(`🔄 ${provider} скоро будет`, { icon: "⏳" });
        }
    };

    const strengthConfig = [
        { label: "Очень слабый", color: "bg-red-500" },
        { label: "Слабый",       color: "bg-orange-500" },
        { label: "Средний",      color: "bg-yellow-500" },
        { label: "Хороший",      color: "bg-emerald-500" },
        { label: "Отличный",     color: "bg-cyan-500" },
    ];

    const currentStrength = strengthConfig[passwordStrength];

    return (
        <div className="space-y-6">
            {/* Имя */}
            <div>
                <label className="text-sm text-zinc-400 block mb-1.5">
                    Имя <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => validateField("name")}
                    className={`w-full bg-zinc-800 border rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 text-base md:text-lg transition-all
                        ${errors.name ? "border-red-500" : "border-zinc-700"}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1.5 px-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
                <label className="text-sm text-zinc-400 block mb-1.5">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => validateField("email")}
                    className={`w-full bg-zinc-800 border rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 text-base md:text-lg transition-all
                        ${errors.email ? "border-red-500" : "border-zinc-700"}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1.5 px-1">{errors.email}</p>}
            </div>

            {/* Пароль */}
            {/* Пароль + Индикатор силы */}
            <div>
                <label className="text-sm text-zinc-400 block mb-1.5">
                    Пароль <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => validateField("password")}
                        className={`w-full bg-zinc-800 border rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 text-base md:text-lg transition-all pr-12
                            ${errors.password ? "border-red-500" : "border-zinc-700"}`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {/* Индикатор силы пароля */}
                {password && (
                    <div className="mt-3">
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${currentStrength.color}`}
                                style={{ width: `${(passwordStrength + 1) * 20}%` }}
                            />
                        </div>
                        <p className={`text-xs mt-1.5 font-medium ${currentStrength.color.replace('bg-', 'text-')}`}>
                            {currentStrength.label}
                        </p>
                    </div>
                )}

                {errors.password && <p className="text-red-500 text-sm mt-1.5 px-1">{errors.password}</p>}
            </div>

            {/* Политика */}
            <div className="flex items-start gap-3 pt-2 px-1">
                <input
                    type="checkbox"
                    id="policy"
                    checked={agreePolicy}
                    onChange={(e) => setAgreePolicy(e.target.checked)}
                    className="mt-1.5 w-5 h-5 accent-cyan-500 bg-zinc-800 border-zinc-700 rounded focus:ring-cyan-400 cursor-pointer"
                    required
                />
                <label
                    htmlFor="policy"
                    className="text-sm md:text-base text-zinc-400 leading-relaxed cursor-pointer"
                >
                    Я согласен с{" "}
                    <span className="text-cyan-400 hover:underline">
                        политикой конфиденциальности
                    </span>{" "}
                    и даю согласие на обработку персональных данных
                </label>
            </div>

            {/* Кнопка регистрации */}
            <button
                onClick={onFormSubmit}
                disabled={isLoading || !agreePolicy}
                className="btn-neon disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isLoading ? "Подождите..." : "Зарегистрироваться"}
            </button>

            <SocialLoginButtons onSocialClick={handleSocialLogin} />

            {/* Telegram Modal */}
            {isTelegramWidgetOpen && (
                <TelegramModal
                    isOpen={isTelegramWidgetOpen}
                    onClose={() => setIsTelegramWidgetOpen(false)}
                />
            )}
        </div>
    );
}