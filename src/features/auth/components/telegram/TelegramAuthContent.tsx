'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';

export default function TelegramAuthContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState('Проверяем ссылку...');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            toast.error("Токен не найден в ссылке");
            router.push('/');
            return;
        }

        const handleAuth = async () => {
            try {
                console.log('🔑 Отправляем токен на проверку...');

                const res = await fetch('/api/auth/verify-telegram', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const result = await res.json();

                if (!result.success || !result.profile) {
                    console.error('❌ Ошибка верификации:', result.error);
                    toast.error(result.error || "Недействительная или устаревшая ссылка");
                    router.push('/');
                    return;
                }

                console.log('✅ Токен валиден, профиль получен');

                // Сохраняем в Zustand
                useAuthStore.setState({
                    user: result.profile,
                    isAuthenticated: true,
                });

                toast.success(`✅ Добро пожаловать, ${result.profile.name}!`, {
                    duration: 5000,
                });

                router.push('/');

            } catch (err: any) {
                console.error('💥 Ошибка при обработке токена:', err);
                toast.error("Не удалось завершить вход. Попробуй ещё раз.");
                router.push('/');
            }
        };

        // Небольшая задержка для стабильности
        const timer = setTimeout(handleAuth, 800);

        return () => clearTimeout(timer);
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