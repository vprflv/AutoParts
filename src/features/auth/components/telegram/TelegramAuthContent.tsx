'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';

export default function TelegramAuthContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState('Проверяем ссылку...');
    const [debugInfo, setDebugInfo] = useState<string>('');

    useEffect(() => {
        const token = searchParams.get('token');

        console.log('🔍 TelegramAuthContent: useEffect сработал');
        console.log('📌 Token из URL:', token ? `${token.substring(0, 15)}...` : 'НЕ НАЙДЕН');

        if (!token) {
            setStatus('Токен не найден в ссылке');
            toast.error("Токен не найден в ссылке");
            router.push('/');
            return;
        }

        const handleAuth = async () => {
            try {
                setStatus('Проверяем токен на сервере...');
                console.log('🔑 Отправляем токен на проверку...');

                const res = await fetch('/api/auth/verify-telegram', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                console.log('📡 Ответ от сервера:', res.status, res.statusText);

                const result = await res.json();
                console.log('📦 Ответ от /verify-telegram:', result);

                if (!result.success || !result.profile) {
                    console.error('❌ Ошибка верификации:', result.error);
                    setDebugInfo(`Ошибка: ${result.error || 'Неизвестная'}`);
                    toast.error(result.error || "Недействительная или устаревшая ссылка");
                    router.push('/');
                    return;
                }

                console.log('✅ Токен валиден! Профиль получен:', result.profile);

                // Сохраняем в Zustand
                useAuthStore.setState({
                    user: result.profile,
                    isAuthenticated: true,
                });

                toast.success(`✅ Добро пожаловать, ${result.profile.name || 'друг'}!`, {
                    duration: 5000,
                });

                router.push('/');

            } catch (err: any) {
                console.error('💥 Критическая ошибка при обработке токена:', err);
                setDebugInfo(`Ошибка: ${err.message}`);
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
            <div className="text-center max-w-md px-6">
                <h1 className="text-3xl font-bold mb-4">Вход через Telegram</h1>
                <p className="text-zinc-400 mb-6">{status}</p>

                {/* Диагностика */}
                {debugInfo && (
                    <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-2xl text-left text-sm text-red-300">
                        <strong>Debug Info:</strong><br />
                        {debugInfo}
                    </div>
                )}
            </div>
        </div>
    );
}