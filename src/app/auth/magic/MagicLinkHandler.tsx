// app/auth/magic/MagicLinkHandler.tsx
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';

export default function MagicLinkHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState('Проверяем ссылку...');
    const [debug, setDebug] = useState<string>('');

    useEffect(() => {
        const token = searchParams.get('token');

        console.log('🔍 MagicLinkHandler: useEffect сработал');
        console.log('📌 Token из URL:', token ? `${token.substring(0, 20)}...` : 'НЕ НАЙДЕН');

        if (!token) {
            setStatus('Токен не найден');
            setDebug('Токен отсутствует в URL');
            toast.error("Токен не найден в ссылке");
            router.push('/');
            return;
        }

        const handleMagicLink = async () => {
            try {
                setStatus('Отправляем токен на сервер...');
                console.log('🔑 Начинаем запрос к /api/auth/magic');

                const res = await fetch('/api/auth/verify-magic', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                console.log('📡 Статус ответа от сервера:', res.status, res.statusText);

                const result = await res.json();
                console.log('📦 Полный ответ от /api/auth/magic:', result);

                setDebug(`Ответ сервера: ${JSON.stringify(result, null, 2)}`);

                if (!result.success || !result.user) {
                    console.error('❌ Ошибка от сервера:', result.error);
                    setStatus('Ошибка авторизации');
                    toast.error(result.error || "Ссылка недействительна или устарела");
                    router.push('/');
                    return;
                }

                console.log('✅ Успешный ответ! Сохраняем пользователя:', result.user);

                // Сохраняем в Zustand
                useAuthStore.setState({
                    user: result.user,
                    isAuthenticated: true,
                });

                console.log('✅ Данные сохранены в Zustand');

                toast.success(`✅ Добро пожаловать, ${result.user.name}!`);
                router.push('/profile?tab=garage');

            } catch (err: any) {
                console.error('💥 Критическая ошибка в handleMagicLink:', err);
                setDebug(`Ошибка: ${err.message}`);
                setStatus('Ошибка при обработке');
                toast.error("Не удалось завершить вход");
                router.push('/');
            }
        };

        handleMagicLink();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-6">
            <div className="text-center max-w-md">
                <h1 className="text-3xl font-bold mb-4">Вход через Telegram</h1>
                <p className="text-zinc-400 mb-6">{status}</p>

                {/* Диагностика */}
                {debug && (
                    <div className="mt-8 p-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-left text-xs text-zinc-400 overflow-auto max-h-96">
                        <strong>Debug Info:</strong><br />
                        <pre>{debug}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}