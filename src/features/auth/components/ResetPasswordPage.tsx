"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";

export default function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [debugInfo, setDebugInfo] = useState<string>("");

    useEffect(() => {
        const debug = async () => {
            const supabase = createClient();
            const type = searchParams.get("type");
            const hasAccessToken = searchParams.has("access_token");
            const hash = window.location.hash;

            let info = `Type: ${type}\nHas access_token: ${hasAccessToken}\nHash exists: ${hash.length > 10}`;

            try {
                const { data: { session } } = await supabase.auth.getSession();
                info += `\nSession exists: ${!!session}`;
                if (session) info += ` | User: ${session.user?.email}`;
            } catch (e) {
                info += `\nSession error: ${e}`;
            }

            console.log("🔍 Reset Password Debug:", info);
            setDebugInfo(info);

            // Основная логика
            if (type === "recovery" || hasAccessToken) {
                console.log("✅ Recovery link detected");
                return;
            }

            // Если ничего не подошло
            console.log("❌ No recovery indicators found");
            toast.error("Ссылка недействительна или устарела");
            setTimeout(() => router.push("/auth"), 2500);
        };

        debug();
    }, [router, searchParams]);

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
            setTimeout(() => router.push("/auth"), 2000);
        } catch (error: any) {
            toast.error(error.message || "Ошибка смены пароля");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="fixed bottom-4 left-4 bg-black/80 text-[10px] p-3 rounded-xl max-w-[300px] text-white z-50 overflow-auto max-h-40">
                <pre>{debugInfo}</pre>
            </div>
            <div className="w-full max-w-md">
                <div className="bg-zinc-900 rounded-3xl border border-zinc-700 p-8 md:p-10">
                    <h1 className="text-3xl font-bold text-center mb-2">Новый пароль</h1>
                    <p className="text-zinc-400 text-center mb-8">Введите новый пароль</p>

                    {/* Диагностика (временно) */}
                    {debugInfo && (
                        <pre className="text-[10px] bg-black/50 p-3 rounded-xl text-zinc-500 mb-6 overflow-auto max-h-40">
                            {debugInfo}
                        </pre>
                    )}

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
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400">
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
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400">
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