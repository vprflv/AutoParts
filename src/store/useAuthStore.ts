import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createClient } from "@/src/lib/supabase/client";

export interface User {
    id: string;
    name?: string | null;
    email: string;
    phone?: string | null;
    telegram_id?: number | null;
    username?: string | null;
    avatar_url?: string | null;
}

interface AuthStore {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isDevMode: boolean;
    lastUserCheck: number;

    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    loginWithTelegram: (telegramUser: any) => Promise<boolean>;   // Новый метод
    updateUser: (updates: Partial<User>) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
    loadUser: () => Promise<void>;
    toggleDevMode: () => void;

    getCurrentUser: () => User | null;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: false,
            error: null,
            isDevMode: false,
            lastUserCheck: 0,

            getCurrentUser: () => {
                const state = get();
                const now = Date.now();
                if (state.user && now - state.lastUserCheck < 8000) {
                    return state.user;
                }
                return state.user;
            },

            loadUser: async () => {
                const now = Date.now();
                set({ lastUserCheck: now });

                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    set({ user: null });
                    return;
                }

                let { data: profile } = await supabase
                    .from("profiles")
                    .select("name, phone")
                    .eq("id", user.id)
                    .single();

                const loadedUser: User = {
                    id: user.id,
                    email: user.email!,
                    name: profile?.name || (user.user_metadata?.name as string) || null,
                    phone: profile?.phone,
                    telegram_id: user.user_metadata?.telegram_id,
                    username: user.user_metadata?.username,
                    avatar_url: user.user_metadata?.avatar_url,
                };

                set({ user: loadedUser });
            },

            loginWithTelegram: async (telegramUser: any) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/auth/telegram', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ telegramUser }),
                    });

                    const result = await response.json();

                    if (!result.success) {
                        set({ error: result.error });
                        return false;
                    }

                    await get().loadUser();
                    return true;
                } catch (err: any) {
                    set({ error: err.message || "Ошибка входа через Telegram" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            // ... остальные твои методы (login, register, logout и т.д.)
            // (оставь их как были)

        }),

        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                isDevMode: state.isDevMode
            }),
        }
    )
);