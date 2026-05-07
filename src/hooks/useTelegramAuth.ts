import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { createClient } from '@/src/lib/supabase/client';

export function useTelegramAuth(isOpen: boolean, onClose: () => void) {
    const processed = useRef(new Set<string>());

    useEffect(() => {
        if (!isOpen) return;

        console.log("🔄 Telegram Auth Polling запущен");

        const interval = setInterval(async () => {
            try {
                // 1. Пробуем обычную загрузку
                await useAuthStore.getState().loadUser();
                let user = useAuthStore.getState().user;

                // 2. Если не нашли — ищем последнего Telegram пользователя
                if (!user) {
                    const supabase = createClient();
                    const { data: profiles } = await supabase
                        .from('profiles')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(1);

                    const profile = profiles?.[0];

                    if (profile && profile.telegram_id && !processed.current.has(profile.id)) {
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

                        console.log("🎉 Пользователь найден через polling!", newUser.name);
                        toast.success("✅ Вы успешно вошли через Telegram!");
                        onClose();
                        clearInterval(interval);
                    }
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, 1800); // чуть меньше 2 секунд

        return () => clearInterval(interval);
    }, [isOpen, onClose]);
}