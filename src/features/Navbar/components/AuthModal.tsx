"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";

import { useAuthStore } from "@/src/store/useAuthStore";
import {useAuthForm} from "@/src/features/auth/hooks/useAuthForm";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const {
        tab,
        setTab,
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
        resetForm,
    } = useAuthForm();

    const { user, logout } = useAuthStore();

    // Новое состояние для показа пароля
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            resetForm();
            setShowPassword(false); // сбрасываем при закрытии
        }
    }, [isOpen]);

    const onSubmit = () => {
        handleSubmit();
    };

    if (user) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
                <div className="bg-zinc-900 rounded-3xl w-full max-w-md mx-4 p-8 text-center">
                    <p className="text-xl mb-6">Привет, {user.name}!</p>
                    <button
                        onClick={() => { logout(); onClose(); }}
                        className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-2xl font-medium"
                    >
                        Выйти
                    </button>
                </div>
            </div>
        );
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-md mx-auto overflow-hidden">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-800">
                    <h2 className="text-2xl font-semibold">Авторизация</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white">
                        <X size={28} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Табы */}
                    <div className="flex border-b border-zinc-800 mb-6">
                        <button
                            onClick={() => setTab("login")}
                            className={`flex-1 py-4 font-medium ${tab === "login" ? "text-white border-b-2 border-blue-600" : "text-zinc-400"}`}
                        >
                            Вход
                        </button>
                        <button
                            onClick={() => setTab("register")}
                            className={`flex-1 py-4 font-medium ${tab === "register" ? "text-white border-b-2 border-blue-600" : "text-zinc-400"}`}
                        >
                            Регистрация
                        </button>
                    </div>

                    {tab === "register" && (
                        <div>
                            <input
                                type="text"
                                placeholder="Имя"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={() => validateField("name")}
                                className={`w-full bg-zinc-800 border ${errors.name ? 'border-red-500' : 'border-zinc-700'} rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-600`}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                    )}

                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => validateField("email")}
                            className={`w-full bg-zinc-800 border ${errors.email ? 'border-red-500' : 'border-zinc-700'} rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-600`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => validateField("password")}
                            className={`w-full bg-zinc-800 border ${errors.password ? 'border-red-500' : 'border-zinc-700'} rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-600 pr-12`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {tab === "register" && (
                        <div className="flex items-start gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="policy"
                                checked={agreePolicy}
                                onChange={(e) => setAgreePolicy(e.target.checked)}
                                className="mt-1 w-5 h-5 accent-blue-600"
                            />
                            <label htmlFor="policy" className="text-sm text-zinc-400 cursor-pointer">
                                Я согласен с <span className="text-blue-500 hover:underline">политикой конфиденциальности</span>
                            </label>
                        </div>
                    )}

                    {tab === "register" && errors.policy && (
                        <p className="text-red-500 text-sm">{errors.policy}</p>
                    )}

                    <button
                        onClick={onSubmit}
                        disabled={isLoading || (tab === "register" && !agreePolicy)}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 py-4 rounded-2xl font-medium text-lg transition-all mt-4"
                    >
                        {isLoading
                            ? "Подождите..."
                            : tab === "login"
                                ? "Войти"
                                : "Зарегистрироваться"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}