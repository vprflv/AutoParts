// src/features/auth/components/RegisterForm.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {useAuthForm} from "@/src/features/auth/hooks/useAuthForm";


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

    return (
        <div className="space-y-6">
            {/* Поле Имя */}
            <div>
                <input
                    type="text"
                    placeholder="Имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => validateField("name")}
                    className={`w-full bg-zinc-800 border ${errors.name ? 'border-red-500' : 'border-zinc-700'} 
                               rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1.5">{errors.name}</p>}
            </div>

            {/* Поле Email */}
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => validateField("email")}
                    className={`w-full bg-zinc-800 border ${errors.email ? 'border-red-500' : 'border-zinc-700'} 
                               rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>}
            </div>

            {/* Поле Пароль с глазом */}
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => validateField("password")}
                    className={`w-full bg-zinc-800 border ${errors.password ? 'border-red-500' : 'border-zinc-700'} 
                               rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 pr-12 text-base`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 transition-colors"
                >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
            </div>

            {/* Чекбокс политики */}
            <div className="flex items-start gap-3 pt-2">
                <input
                    type="checkbox"
                    id="policy"
                    checked={agreePolicy}
                    onChange={(e) => setAgreePolicy(e.target.checked)}
                    className="mt-1.5 w-5 h-5 accent-blue-600 bg-zinc-800 border-zinc-700 rounded focus:ring-blue-600"
                />
                <label htmlFor="policy" className="text-sm text-zinc-400 leading-relaxed cursor-pointer">
                    Я согласен с <span className="text-blue-500 hover:underline">политикой конфиденциальности</span>
                </label>
            </div>

            {errors.policy && (
                <p className="text-red-500 text-sm mt-1">{errors.policy}</p>
            )}

            {/* Кнопка регистрации */}
            <button
                onClick={handleSubmit}
                disabled={isLoading || !agreePolicy}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 py-4 rounded-2xl font-medium text-lg transition-all mt-4"
            >
                {isLoading ? "Подождите..." : "Зарегистрироваться"}
            </button>
        </div>
    );
}