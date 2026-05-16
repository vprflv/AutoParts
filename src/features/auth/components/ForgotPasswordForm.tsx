"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { createClient } from "@/src/lib/supabase/client";

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
        if (!email.trim()) return;

        setIsSubmitting(true);

        try {
            const supabase = createClient();

            await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
            });

            setIsSuccess(true);
            toast.success("Если аккаунт существует, ссылка отправлена на почту");

        } catch (error: any) {
            // Даже при ошибке показываем успех (security best practice)
            setIsSuccess(true);
            toast.success("Если аккаунт существует, ссылка отправлена на почту");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {isSuccess ? (
                <div className="text-center py-10 md:py-12">
                    <div className="text-6xl mb-6">📧</div>
                    <h3 className="text-2xl md:text-3xl font-semibold mb-3">
                        Ссылка отправлена
                    </h3>
                    <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                        Если аккаунт с таким email существует, мы отправили ссылку для сброса пароля.
                    </p>
                    <p className="text-sm text-zinc-500 mt-4">
                        Проверьте папку «Спам», если письмо не пришло
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
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 text-base md:text-lg transition-all"
                            placeholder="you@example.com"
                        />
                        <p className="text-xs md:text-sm text-zinc-500 mt-2 px-1">
                            Укажите email, который вы использовали при регистрации
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !email.trim()}
                        className="btn-neon disabled:cursor-not-allowed disabled:opacity-50"
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