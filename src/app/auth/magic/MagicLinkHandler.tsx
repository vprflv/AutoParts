"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';

export default function MagicLinkHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [status, setStatus] = useState('Проверяем ссылку...');
    const [debug, setDebug] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleMagicLink = useCallback(async (token: string) => {
        try {
            setStatus('Отправляем токен на сервер...');
            setError('');

            const res = await fetch('/api/auth/verify-magic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            const result = await res.json();

            setDebug(`Статус: ${res.status}\n\n${JSON.stringify(result, null, 2)}`);

            if (!result.success || !result.user) {
                setError(result.error || "Неизвестная ошибка сервера");
                setStatus('Не удалось войти');
                return;
            }

            useAuthStore.setState({
                user: result.user,
                isAuthenticated: true,
            });

            setIsSuccess(true);
            setStatus('✅ Авторизация прошла успешно!');
            toast.success(`Добро пожаловать, ${result.user.name}!`);

            // Можно закомментировать, если не хочешь автоматический редирект
            setTimeout(() => router.push('/profile?tab=garage'), 1500);

        } catch (err: any) {
            setError(err.message || 'Критическая ошибка');
            setStatus('Ошибка обработки');
            setDebug(`Exception: ${err.message}\n${err.stack || ''}`);
        }
    }, [router]);

    useEffect(() => {
        const token = searchParams.get('token');
        console.log('🔍 Token из URL:', token ? token.substring(0, 50) + '...' : 'НЕ НАЙДЕН');

        if (!token) {
            setError('Токен отсутствует в URL');
            setStatus('Ошибка ссылки');
            return;
        }

        handleMagicLink(token);
    }, [searchParams, handleMagicLink]);

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8">🔑 Magic Link Debug</h1>

                <div className="text-center mb-6">
                    <p className="text-2xl">{status}</p>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-600 p-6 rounded-2xl mb-6">
                        <strong className="text-red-400">❌ {error}</strong>
                    </div>
                )}

                {isSuccess && (
                    <div className="bg-green-900/50 border border-green-600 p-6 rounded-2xl mb-6">
                        <strong className="text-green-400">✅ Успешный вход</strong>
                    </div>
                )}

                {debug && (
                    <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl text-sm overflow-auto max-h-[600px]">
                        <strong>Debug:</strong>
                        <pre className="mt-3 text-emerald-300 whitespace-pre-wrap">{debug}</pre>
                    </div>
                )}

                <div className="flex gap-4 justify-center mt-10">
                    <button onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl">
                        Повторить запрос
                    </button>
                    <button onClick={() => router.push('/')}
                            className="px-8 py-3 bg-white text-black hover:bg-zinc-200 rounded-xl">
                        На главную
                    </button>
                </div>
            </div>
        </div>
    );
}