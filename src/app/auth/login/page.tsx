"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { useAdminStore } from "@/store/useAdminStore";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '/admin';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const supabase = createClient();

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (error) {
                toast.error(error.message);
                return;
            }

            // Получаем текущего пользователя
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error("Не удалось получить данные пользователя");
                return;
            }

            // Проверяем роль (через API route — безопасно)
            const res = await fetch('/api/auth/check-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id }),
            });

            const data = await res.json();

            if (!data.success || data.role !== "ADMIN") {
                await supabase.auth.signOut();
                toast.error("У вас нет прав администратора");
                return;
            }

            // Сохраняем админские данные
            useAdminStore.getState().setAdminUser({
                id: user.id,
                email: user.email || '',
                name: data.name,
                role: data.role,
            });

            toast.success("Добро пожаловать в админку!");
            router.push(redirectTo);
            router.refresh();

        } catch (err) {
            toast.error("Произошла ошибка при входе");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Вход в админку</h1>
                        <p className="text-zinc-500">Только для администраторов</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Пароль</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 rounded-2xl font-semibold text-lg transition"
                        >
                            {isLoading ? "Вход..." : "Войти"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}