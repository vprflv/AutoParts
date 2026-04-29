// src/features/auth/components/RegisterForm.tsx
"use client";

import { useState } from "react";
import { useAuthForm } from "@/src/features/auth/hooks/useAuthForm";
import SocialLoginButtons from "@/src/features/auth/components/SocialLoginButtons";
import { Eye, EyeOff } from "lucide-react";
import {toast} from "react-hot-toast";

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
    } = useAuthForm();

    const [showPassword, setShowPassword] = useState(false);

    const onFormSubmit = async () => {
        const success = await handleSubmit();

        if (success) {
            toast.success("Регистрация прошла успешно! ✅");
            onClose();
        }
    };

    const handleSocialLogin = (provider: string) => {
        alert(`🔄 Регистрация через ${provider} будет реализована позже`);
    };

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
                    className={`w-full bg-zinc-800 border rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base md:text-lg transition-all
                        ${errors.name ? "border-red-500" : "border-zinc-700"}`}
                />
                {errors.name && (
                    <p className="text-red-500 text-sm mt-1.5 px-1">{errors.name}</p>
                )}
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
                    className={`w-full bg-zinc-800 border rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base md:text-lg transition-all
                        ${errors.email ? "border-red-500" : "border-zinc-700"}`}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1.5 px-1">{errors.email}</p>
                )}
            </div>

            {/* Пароль с глазом */}
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
                        className={`w-full bg-zinc-800 border rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base md:text-lg transition-all
                            ${errors.password ? "border-red-500" : "border-zinc-700"}`}
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

            {/* Чекбокс политики */}
            <div className="flex items-start gap-3 pt-2 px-1">
                <input
                    type="checkbox"
                    id="policy"
                    checked={agreePolicy}
                    onChange={(e) => setAgreePolicy(e.target.checked)}
                    className="mt-1.5 w-5 h-5 accent-blue-600 bg-zinc-800 border-zinc-700 rounded flex-shrink-0"
                    required
                />
                <label
                    htmlFor="policy"
                    className="text-sm md:text-base text-zinc-400 leading-relaxed cursor-pointer"
                >
                    Я согласен с{" "}
                    <span className="text-blue-500 hover:underline">
                        политикой конфиденциальности
                    </span>{" "}
                    и даю согласие на обработку персональных данных
                </label>
            </div>

            <button
                onClick={onFormSubmit}
                disabled={isLoading || !agreePolicy}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 py-4 rounded-2xl font-medium text-lg md:text-xl transition-all active:scale-[0.985]"
            >
                {isLoading ? "Подождите..." : "Зарегистрироваться"}
            </button>

            <SocialLoginButtons onSocialClick={handleSocialLogin} />
        </div>
    );
}