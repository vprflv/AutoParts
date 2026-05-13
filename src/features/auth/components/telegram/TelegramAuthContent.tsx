'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { createServerClientFn } from '@/src/lib/supabase/server'; // ← добавь импорт

export default function TelegramAuthContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState('Проверяем ссылку...');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            toast.error("Токен не найден");
            router.push('/');
            return;
        }

        const handleAuth = async () => {
            try {
                const res = await fetch('/api/auth/verify-telegram', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const result = await res.json();

                if (!result.success || !result.profile) {
                    toast.error(result.error || "Недействительная ссылка");
                    router.push('/');
                    return;
                }

                // === КРИТИЧНАЯ ЧАСТЬ ===
                const supabase = await createServerClientFn();

                // Устанавливаем сессию Supabase
                const { error: sessionError } = await supabase.auth.setSession({
                    access_token: token, // можно попробовать, но лучше получить настоящий токен
                    refresh_token: ''   // пока пусто
                });

                if (sessionError) {
                    console.error("Ошибка установки сессии:", sessionError);
                }

                // Сохраняем в Zustand
                useAuthStore.setState({
                    user: result.profile,
                    isAuthenticated: true,
                });

                toast.success(`✅ Добро пожаловать, ${result.profile.name}!`);
                router.push('/profile?tab=garage'); // сразу в гараж для теста

            } catch (err: any) {
                console.error(err);
                toast.error("Не удалось завершить вход");
                router.push('/');
            }
        };

        setTimeout(handleAuth, 600);
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Вход через Telegram</h1>
                <p className="text-zinc-400">{status}</p>
            </div>
        </div>
    );
}