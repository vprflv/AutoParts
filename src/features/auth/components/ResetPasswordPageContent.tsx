"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";

export default function ResetPasswordContent() {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Явно восстанавливаем сессию из hash
    useEffect(() => {
        const recoverSession = async () => {
            const supabase = createClient();

            try {
                // Это ключевой момент — Supabase сам обрабатывает hash из URL
                const { data, error } = await supabase.auth.getSession();

                if (error || !data.session) {
                    console.error("Recovery session error:", error);
                    toast.error("Ссылка устарела. Запросите новую");
                    setTimeout(() => router.push("/"), 2000);
                } else {
                    console.log("✅ Recovery session restored successfully");
                }
            } catch (err) {
                console.error(err);
                toast.error("Ошибка восстановления сессии");
            }
        };

        recoverSession();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) return toast.error("Пароль минимум 6 символов");
        if (password !== confirmPassword) return toast.error("Пароли не совпадают");

        setIsLoading(true);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({ password });

            if (error) throw error;

            setIsSuccess(true);
            toast.success("Пароль успешно изменён!");

            setTimeout(() => router.push("/"), 1800);
        } catch (error: any) {
            toast.error(error.message || "Не удалось сменить пароль");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 text-center">
                <div>
                    <div className="text-6xl mb-6">✅</div>
                    <h1 className="text-3xl font-bold mb-3">Пароль изменён</h1>
                    <p className="text-zinc-400">Перенаправляем...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-zinc-900 rounded-3xl border border-zinc-700 p-8 md:p-10">
                    <h1 className="text-3xl font-bold text-center mb-2">Новый пароль</h1>
                    <p className="text-zinc-400 text-center mb-8">Придумайте новый пароль</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm text-zinc-400 mb-1.5">Новый пароль</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400"
                                    placeholder="Новый пароль"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-zinc-400 mb-1.5">Повторите пароль</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400"
                                    placeholder="Повторите пароль"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-neon disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading ? "Сохраняем..." : "Сменить пароль"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}