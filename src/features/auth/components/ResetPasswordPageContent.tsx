"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";

export default function ResetPasswordPageContent() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        // Проверяем, что пользователь пришёл по recovery ссылке
        const checkSession = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                toast.error("Ссылка недействительна или устарела");
                router.push("/auth");
            }
        };

        checkSession();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error("Пароль должен быть не менее 6 символов");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Пароли не совпадают");
            return;
        }

        setIsLoading(true);

        try {
            const supabase = createClient();

            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            setIsSuccess(true);
            toast.success("Пароль успешно изменён!");

            // Редирект на логин через 2 секунды
            setTimeout(() => {
                router.push("/auth");
            }, 2000);

        } catch (error: any) {
            toast.error(error.message || "Не удалось изменить пароль");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-6">✅</div>
                    <h1 className="text-3xl font-bold mb-4">Пароль успешно изменён</h1>
                    <p className="text-zinc-400 mb-8">
                        Вы будете перенаправлены на страницу входа
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-zinc-900 rounded-3xl border border-zinc-700 p-8 md:p-10">
                    <h1 className="text-3xl font-bold text-center mb-2">Новый пароль</h1>
                    <p className="text-zinc-400 text-center mb-8">
                        Придумайте новый пароль для вашего аккаунта
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm text-zinc-400 mb-1.5">Новый пароль</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 text-base"
                                    placeholder="••••••••"
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
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 text-base"
                                    placeholder="••••••••"
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
                            className="btn-neon disabled:cursor-not-allowed disabled:opacity-50 mt-4"
                        >
                            {isLoading ? "Сохраняем пароль..." : "Сменить пароль"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}