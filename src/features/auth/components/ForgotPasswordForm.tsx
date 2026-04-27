"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

interface ForgotPasswordFormProps {
    onClose: () => void;
    setTab: (tab: "login" | "register" | "forgot") => void;
}

export default function ForgotPasswordForm({ onClose, setTab }: ForgotPasswordFormProps) {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);

        // Симуляция отправки письма
        await new Promise(resolve => setTimeout(resolve, 1200));

        toast.success("Ссылка для сброса пароля отправлена на почту!Проверьте папку «Спам», если письмо не пришло")

        setIsSuccess(true);
        setIsSubmitting(false);

        // Через 3 секунды возвращаемся на форму входа
        setTimeout(() => {
            setTab("login");
            onClose();
        }, 2500);
    };

    return (
        <div className="space-y-6">
            {isSuccess ? (
                <div className="text-center py-10 md:py-12">
                    <div className="text-6xl mb-6">📧</div>
                    <h3 className="text-2xl md:text-3xl font-semibold mb-3">
                        Письмо отправлено
                    </h3>
                    <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                        Мы отправили ссылку для сброса пароля на{" "}
                        <span className="text-white font-medium">{email}</span>
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm md:text-base text-zinc-400 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base md:text-lg transition-all"
                            placeholder="you@example.com"
                        />
                        <p className="text-xs md:text-sm text-zinc-500 mt-2 px-1">
                            Мы отправим вам ссылку для сброса пароля
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !email}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 py-4 rounded-2xl font-semibold text-lg md:text-xl transition-all active:scale-[0.985]"
                    >
                        {isSubmitting ? "Отправляем..." : "Отправить ссылку"}
                    </button>

                    <button
                        type="button"
                        onClick={() => setTab("login")}
                        className="w-full text-zinc-400 hover:text-white py-4 text-base transition-colors active:scale-[0.985]"
                    >
                        Вернуться ко входу
                    </button>
                </form>
            )}
        </div>
    );
}