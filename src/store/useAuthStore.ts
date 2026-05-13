// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    username?: string | null;
    avatarUrl?: string | null;
    telegramId?: string | null;
    phone?: string | null;
    provider: "email" | "telegram";
}

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    loadUser: () => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    login: (email: string, password: string) => Promise<boolean>;
    updateUser: (updates: Partial<User>) => Promise<void>;
    loginWithTelegram: (telegramUser: any) => Promise<boolean>;
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
                try {
                    const res = await fetch('/api/auth/me', {
                        credentials: 'include'
                    });

                    if (!res.ok) {
                        set({ user: null, isAuthenticated: false });
                        return;
                    }

                    const { user } = await res.json();
                    set({
                        user,
                        isAuthenticated: true
                    });
                } catch (err) {
                    console.error("loadUser error:", err);
                    set({ user: null, isAuthenticated: false });
                }
            },

            register: async (name: string, email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, password }),
                    });

                    const data = await res.json();
                    if (!data.success) throw new Error(data.error || "Ошибка регистрации");

                    await get().loadUser();
                    return true;
                } catch (err: any) {
                    set({ error: err.message });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await res.json();
                    if (!data.success) throw new Error(data.error || "Ошибка входа");

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
                    // ←←← Важно! Убедись, что путь правильный
                    const res = await fetch('/api/auth/magic', {   // или /api/auth/telegram — как у тебя настроено
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(telegramUser),        // обычно { telegramId, name, username, avatarUrl }
                    });

                    const data = await res.json();
                    if (!data.success) throw new Error(data.error || "Ошибка входа через Telegram");

                    await get().loadUser();
                    return true;
                } catch (err: any) {
                    console.error("Telegram login error:", err);
                    set({ error: err.message });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            updateUser: async (updates: Partial<User>) => {
                const current = get().user;
                if (!current) return;

                try {
                    const res = await fetch('/api/auth/update', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updates),
                        credentials: 'include'
                    });

                    if (!res.ok) throw new Error("Не удалось обновить профиль");

                    const { user: updated } = await res.json();

                    set((state) => ({
                        user: state.user ? { ...state.user, ...updated } : null,
                    }));
                } catch (err: any) {
                    console.error("updateUser error:", err);
                    set({ error: err.message });
                }
            },

            logout: async () => {
                try {
                    await fetch('/api/auth/logout', {
                        method: 'POST',
                        credentials: 'include'
                    });
                } catch (e) {
                    console.error("Logout error:", e);
                }
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