'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { createClient } from '@/src/lib/supabase/client';

export function TelegramAuthContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const userId = searchParams.get('userId');   // ← главное изменение

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            toast.error("userId не найден в ссылке");
            router.push('/');
            return;
        }

        console.log("🔑 Получен userId:", userId);

        const loadUser = async () => {
            try {
                const supabase = createClient();

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (profile) {
                    const newUser = {
                        id: profile.id,
                        name: profile.name,
                        email: profile.email,
                        telegram_id: profile.telegram_id,
                        username: profile.username,
                        avatar_url: profile.avatar_url,
                    };

                    useAuthStore.setState({ user: newUser });
                    toast.success(`✅ Добро пожаловать, ${profile.name}!`);
                    router.push('/'); // или '/dashboard'
                } else {
                    toast.error("Пользователь не найден в базе");
                    router.push('/');
                }
            } catch (err) {
                console.error(err);
                toast.error("Ошибка при загрузке профиля");
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [userId, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Вход через Telegram</h1>
                <p className="text-zinc-400">
                    {loading ? "Загружаем ваш профиль..." : "Перенаправляем..."}
                </p>
            </div>
        </div>
    );
}