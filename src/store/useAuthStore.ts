// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createClient } from "@/src/lib/supabase/client";

export interface User {
    id: string;
    name?: string | null;
    email: string;
    phone?: string | null;
}

interface AuthStore {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isDevMode: boolean;
    lastUserCheck: number;

    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
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

                // Пытаемся получить профиль
                let { data: profile } = await supabase
                    .from("profiles")
                    .select("name, phone")
                    .eq("id", user.id)
                    .single();

                // Если профиля нет — создаём
                if (!profile) {
                    const { error: insertError } = await supabase
                        .from("profiles")
                        .insert({
                            id: user.id,
                            name: user.user_metadata?.name || null,
                            email: user.email!,
                        });

                    if (!insertError) {
                        const { data: newProfile } = await supabase
                            .from("profiles")
                            .select("name, phone")
                            .eq("id", user.id)
                            .single();

                        profile = newProfile;
                    }
                }

                const loadedUser: User = {
                    id: user.id,
                    email: user.email!,
                    name: profile?.name || (user.user_metadata?.name as string) || null,
                    phone: profile?.phone,
                };

                set({ user: loadedUser });
                console.log("✅ loadUser completed");
            },

            login: async (email: string, password: string) => {
                console.log("🔥 LOGIN FUNCTION CALLED with:", { email, password });

                set({ isLoading: true, error: null });
                const supabase = createClient();

                try {
                    console.log("→ Sending signInWithPassword request...");

                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password
                    });

                    console.log("← Response received:", {
                        hasData: !!data,
                        hasSession: !!data?.session,
                        error
                    });

                    if (error) {
                        console.error("Supabase returned error:", error);
                        set({ error: error.message });
                        return false;
                    }

                    console.log("✅ signInWithPassword successful");
                    await get().loadUser();
                    console.log("✅ loadUser completed");

                    return true;
                } catch (err: any) {
                    console.error("💥 Unexpected error in login:", err);
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
                        .update({
                            name: updates.name,
                            phone: updates.phone,
                        })
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