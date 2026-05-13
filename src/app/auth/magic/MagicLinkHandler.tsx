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

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            toast.error("Токен не найден в ссылке");
            router.push('/');
            return;
        }

        const handleMagicLink = async () => {
            try {
                setStatus('Авторизация...');

                const res = await fetch('/api/auth/magic', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const result = await res.json();

                if (!result.success || !result.user) {
                    toast.error(result.error || "Ссылка недействительна или устарела");
                    router.push('/');
                    return;
                }

                // Сохраняем пользователя
                useAuthStore.setState({
                    user: result.user,
                    isAuthenticated: true,
                });

                toast.success(`✅ Добро пожаловать, ${result.user.name || 'Пользователь'}!`);

                // Переходим сразу в гараж для удобства
                router.push('/profile?tab=garage');

            } catch (err: any) {
                console.error('Ошибка magic link:', err);
                toast.error("Не удалось завершить вход. Попробуйте ещё раз.");
                router.push('/');
            }
        };

        handleMagicLink();
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