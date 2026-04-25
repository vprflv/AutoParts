// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
    id: string;
    name: string;
    email: string;
    // Добавь сюда другие поля при необходимости: avatar, phone, role и т.д.
}

interface AuthStore {
    user: User | null;
    isLoading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });

                try {
                    // TODO: Здесь будет реальный API запрос
                    // const res = await fetch('/api/auth/login', { ... })

                    // Пока имитация
                    if (!email || !password) throw new Error("Email и пароль обязательны");

                    // Имитация задержки сервера
                    await new Promise(resolve => setTimeout(resolve, 800));

                    const user: User = {
                        id: "user_" + Date.now(),
                        name: "Пользователь", // В будущем придёт с сервера
                        email,
                    };

                    set({ user, isLoading: false });
                    return true;
                } catch (err: any) {
                    set({
                        error: err.message || "Неверный email или пароль",
                        isLoading: false
                    });
                    return false;
                }
            },

            register: async (name: string, email: string, password: string) => {
                set({ isLoading: true, error: null });

                try {
                    if (!name || !email || !password) throw new Error("Все поля обязательны");

                    await new Promise(resolve => setTimeout(resolve, 900));

                    const user: User = {
                        id: "user_" + Date.now(),
                        name,
                        email,
                    };

                    set({ user, isLoading: false });
                    return true;
                } catch (err: any) {
                    set({
                        error: err.message || "Ошибка регистрации",
                        isLoading: false
                    });
                    return false;
                }
            },

            logout: () => {
                set({ user: null, error: null });
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