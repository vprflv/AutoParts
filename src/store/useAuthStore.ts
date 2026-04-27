import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
}

interface AuthStore {
    user: User | null;
    isLoading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    updateUser: (updates: Partial<User>) => void;
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
                    if (!email || !password) throw new Error("Email и пароль обязательны");

                    await new Promise(resolve => setTimeout(resolve, 800));

                    const user: User = {
                        id: "user_" + Date.now(),
                        name: "Алексей Петров",
                        email,
                        phone: "+7 (999) 123-45-67",
                    };

                    set({ user, isLoading: false });
                    return true;
                } catch (err: any) {
                    set({
                        error: err.message || "Неверный email или пароль",
                        isLoading: false,
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
                        phone: "+7 (999) 000-00-00",
                    };

                    set({ user, isLoading: false });
                    return true;
                } catch (err: any) {
                    set({
                        error: err.message || "Ошибка регистрации",
                        isLoading: false,
                    });
                    return false;
                }
            },

            updateUser: (updates: Partial<User>) => {
                set((state) => {
                    if (!state.user) {
                        // Создаём демо-пользователя при первом редактировании
                        const demoUser: User = {
                            id: "demo-user-" + Date.now(),
                            name: "Алексей Петров",
                            email: "test@autopart.pro",
                            phone: "+7 (999) 123-45-67",
                        };
                        return { user: { ...demoUser, ...updates } };
                    }

                    return { user: { ...state.user, ...updates } };
                });
            },

            logout: () => set({ user: null, error: null }),
            clearError: () => set({ error: null }),
        }),

        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user }),
        }
    )
);