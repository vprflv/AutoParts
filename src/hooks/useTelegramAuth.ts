import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { createClient } from '@/src/lib/supabase/client';

export function useTelegramAuth(isOpen: boolean, onClose: () => void) {
    const processed = useRef(new Set<string>());

    useEffect(() => {
        if (!isOpen) {
            processed.current.clear();
            return;
        }

        console.log("🔄 Telegram Auth Polling запущен");

        const interval = setInterval(async () => {
            try {
                // 1. Обычная загрузка через сессию
                await useAuthStore.getState().loadUser();
                let user = useAuthStore.getState().user;

                // 2. Если не нашли — ищем последнего Telegram пользователя
                if (!user) {
                    const supabase = createClient();
                    const { data: profiles } = await supabase
                        .from('profiles')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(5); // берём последние 5 на всякий случай

                    const profile = profiles?.find(p => p.telegram_id);

                    if (profile && !processed.current.has(profile.id)) {
                        const newUser = {
                            id: profile.id,
                            name: profile.name,
                            email: profile.email || `${profile.telegram_id}@telegram.local`,
                            telegram_id: profile.telegram_id,
                            username: profile.username,
                            avatar_url: profile.avatar_url,
                        };

                        useAuthStore.setState({ user: newUser });
                        processed.current.add(profile.id);

                        console.log("🎉 Пользователь найден и сохранён в Zustand!", newUser);
                        toast.success(`✅ Добро пожаловать, ${newUser.name}!`);
                        onClose();
                        clearInterval(interval);
                    }
                } else {
                    // Если пользователь уже есть — сразу закрываем
                    console.log("✅ Пользователь уже в сторе");
                    toast.success(`✅ Добро пожаловать, ${user.name}!`);
                    onClose();
                    clearInterval(interval);
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [isOpen, onClose]);
}