// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createClient } from "@/src/lib/supabase/client";

export interface User {
    id: string;
    email: string;
    name?: string | null;
    username?: string | null;
    phone?: string | null;
    avatar_url?: string | null;
    telegram_id?: number | null;
}

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    loadUser: () => Promise<void>;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    loginWithTelegram: (telegramUser: any) => Promise<boolean>;
    updateUser: (updates: Partial<User>) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            loadUser: async () => {
                const supabase = createClient();
                const { data: { user: authUser } } = await supabase.auth.getUser();

                if (!authUser) {
                    set({ user: null, isAuthenticated: false });
                    return;
                }

                let { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("userid", authUser.id)
                    .single();

                if (!profile) {
                    console.log("📝 Профиля нет, создаём новый...");
                    await supabase.from("profiles").insert({
                        userid: authUser.id,
                        email: authUser.email!,
                        name: authUser.user_metadata?.name || null,
                    });
                }

                // Перезагружаем профиль
                ({ data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("userid", authUser.id)
                    .single());

                const loadedUser: User = {
                    id: authUser.id,
                    email: profile?.email || authUser.email!,
                    name: profile?.name,
                    username: profile?.username,
                    phone: profile?.phone,
                    avatar_url: profile?.avatar_url,
                    telegram_id: profile?.telegram_id,
                };

                set({ user: loadedUser, isAuthenticated: true });
            },

            register: async (name: string, email: string, password: string) => {
                set({ isLoading: true, error: null });
                const supabase = createClient();

                try {
                    console.log("🔄 Регистрация:", { email, name });

                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: { data: { name } }
                    });

                    if (error) throw error;

                    if (data.user?.id) {
                        console.log("📝 Создаём профиль для userid:", data.user.id);

                        const { error: profileError } = await supabase
                            .from("profiles")
                            .insert({
                                userid: data.user.id,
                                email: email,
                                name: name,
                            });

                        if (profileError) {
                            console.error("❌ Ошибка создания профиля:", profileError);
                        } else {
                            console.log("✅ Профиль успешно создан в profiles");
                        }
                    }

                    await get().loadUser();
                    return true;
                } catch (err: any) {
                    console.error("❌ Register error:", err);
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
                    const { error } = await supabase.auth.signInWithPassword({ email, password });
                    if (error) throw error;

                    await get().loadUser();
                    return true;
                } catch (err: any) {
                    set({ error: err.message });
                    return false;
                } finally {
                    set({ isLoading: false });
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
                    if (!result.success) throw new Error(result.error);

                    await get().loadUser();
                    return true;
                } catch (err: any) {
                    set({ error: err.message });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            updateUser: async (updates: Partial<User>) => {
                const current = get().user;
                if (!current) return;

                const supabase = createClient();
                await supabase
                    .from("profiles")
                    .update(updates)
                    .eq("userid", current.id);

                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null,
                }));
            },

            logout: async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                set({ user: null, isAuthenticated: false, error: null });
            },

            clearError: () => set({ error: null }),
        }),

        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user }),
        }
    )
);