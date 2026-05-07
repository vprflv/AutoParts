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
    loginWithTelegram: (telegramUser: any) => Promise<boolean>;
    updateUser: (updates: Partial<User>) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
    loadUser: () => Promise<void>;
    toggleDevMode: () => void;
    setUser: (user: User) => void;
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

            getCurrentUser: () => get().user,

            loadUser: async () => {
                console.log("🔄 loadUser вызван");
                const supabase = createClient();

                const { data: { user } } = await supabase.auth.getUser();
                console.log("supabase.auth.getUser() вернул:", user?.id || "null");

                if (!user) {
                    set({ user: null });
                    return;
                }

                const { data: profile } = await supabase
                    .from("profiles")
                    .select("name, username, avatar_url, telegram_id")
                    .eq("id", user.id)
                    .single();

                const loadedUser: User = {
                    id: user.id,
                    email: user.email || `${user.id}@telegram.local`,
                    name: profile?.name || user.user_metadata?.first_name,
                    telegram_id: profile?.telegram_id || user.user_metadata?.telegram_id,
                    username: profile?.username || user.user_metadata?.username,
                    avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
                };

                set({ user: loadedUser });
                console.log("✅ Пользователь загружен:", loadedUser.name);
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
                    console.log("Ответ от сервера:", result);

                    if (!result.success) {
                        set({ error: result.error });
                        return false;
                    }

                    // === ГРЯЗНЫЙ, НО РАБОЧИЙ FALLBACK ===
                    const newUser: User = {
                        id: result.userId || `tg_${telegramUser.id}`,
                        email: `${telegramUser.id}@telegram.local`,
                        name: telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : ''),
                        telegram_id: telegramUser.id,
                        username: telegramUser.username,
                        avatar_url: telegramUser.photo_url,
                    };

                    set({ user: newUser });
                    console.log("✅ Пользователь сохранён в Zustand (fallback):", newUser);

                    return true;

                } catch (err: any) {
                    console.error(err);
                    set({ error: err.message });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            setUser: (newUser: User) => set({ user: newUser }),


            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                const supabase = createClient();

                try {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password
                    });

                    if (error) {
                        set({ error: error.message });
                        return false;
                    }

                    await get().loadUser();
                    return true;
                } catch (err: any) {
                    set({ error: err.message || "Неизвестная ошибка" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            register: async (name: string, email: string, password: string) => {
                set({ isLoading: true, error: null });
                const supabase = createClient();

                try {
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: { data: { name } },
                    });

                    if (error) throw error;

                    if (data.user) {
                        await supabase.from("profiles").insert({
                            id: data.user.id,
                            name,
                            email,
                        });
                    }

                    if (data.session) {
                        await get().loadUser();
                    }

                    return true;
                } catch (err: any) {
                    set({ error: err.message || "Ошибка регистрации" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            updateUser: async (updates: Partial<User>) => {
                const currentUser = get().user;
                if (!currentUser) return;

                const supabase = createClient();
                try {
                    await supabase
                        .from("profiles")
                        .update(updates)
                        .eq("id", currentUser.id);

                    set((state) => ({
                        user: state.user ? { ...state.user, ...updates } : null,
                    }));
                } catch (err) {
                    console.error(err);
                }
            },

            logout: async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                set({ user: null, error: null, lastUserCheck: 0 });
            },

            clearError: () => set({ error: null }),
            toggleDevMode: () => set((state) => ({ isDevMode: !state.isDevMode })),
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