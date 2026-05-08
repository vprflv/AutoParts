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

    updateUser: (updates: Partial<User>) => Promise<void>;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    loginWithTelegram: (telegramUser: any) => Promise<boolean>;
    logout: () => Promise<void>;
    loadUser: () => Promise<void>;
    setUser: (user: User) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: false,
            error: null,

            setUser: (newUser: User) => set({ user: newUser }),

            loadUser: async () => {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

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
                    console.error(err);
                    set({ error: err.message });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                const supabase = createClient();

                try {
                    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

                    if (error) {
                        set({ error: error.message });
                        return false;
                    }

                    await get().loadUser();
                    return true;
                } catch (err: any) {
                    set({ error: err.message });
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

                    if (data.session) await get().loadUser();

                    return true;
                } catch (err: any) {
                    set({ error: err.message });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                set({ user: null, error: null });
            },

            clearError: () => set({ error: null }),
        }),

        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
            }),
        }
    )
);