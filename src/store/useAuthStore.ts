// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    username?: string | null;
    avatarUrl?: string | null;
    telegramId?: string | null;
    phone?: string | null;
    provider: 'email' | 'telegram';
}

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    loadUser: () => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    login: (email: string, password: string) => Promise<boolean>;
    updateUser: (updates: Partial<User>) => Promise<boolean>;
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
                    const res = await fetch('/api/auth/me', { credentials: 'include' });
                    if (!res.ok) {
                        set({ user: null, isAuthenticated: false });
                        return;
                    }
                    const { user } = await res.json();
                    set({ user, isAuthenticated: true });
                } catch (err) {
                    console.error('loadUser error:', err);
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
                    if (!data.success)
                        throw new Error(data.error || 'Ошибка регистрации');

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
                    if (!data.success) throw new Error(data.error || 'Ошибка входа');

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
                if (!current) {
                    set({ error: 'Пользователь не авторизован' });
                    return false;
                }

                set({ isLoading: true, error: null });

                try {
                    const res = await fetch('/api/auth/update', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updates),
                        credentials: 'include',
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(
                            data.error || data.message || 'Не удалось обновить профиль'
                        );
                    }

                    set((state:AuthStore) => ({
                        user: state.user ? { ...state.user, ...data.user } : null,
                    }));

                    return true;
                } catch (err: any) {
                    console.error('updateUser error:', err);
                    set({ error: err.message || 'Ошибка обновления профиля' });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            loginWithTelegram: async (telegramUser:any) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch('/api/auth/magic', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(telegramUser),
                    });

                    const data = await res.json();
                    if (!data.success)
                        throw new Error(data.error || 'Ошибка входа через Telegram');

                    await get().loadUser();
                    return true;
                } catch (err: any) {
                    console.error('Telegram login error:', err);
                    set({ error: err.message });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: async () => {
                try {
                    await fetch('/api/auth/logout', {
                        method: 'POST',
                        credentials: 'include',
                    });
                } catch (e) {
                    console.error('Logout error:', e);
                }
                set({ user: null, isAuthenticated: false, error: null });
            },

            clearError: () => set({ error: null }),
        }),

        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state:AuthStore) => ({ user: state.user }),
        }
    )
);
