// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/src/types";

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
            user: null,           // ← оставляем null
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                // ... твой текущий код login
            },

            register: async (name: string, email: string, password: string) => {
                // ... твой текущий код register
            },


            updateUser: (updates: Partial<User>) => {
                set((state) => ({
                    user: state.user
                        ? { ...state.user, ...updates }
                        : {
                            id: "demo-user-" + Date.now(),
                            name: "Алексей Петров",
                            email: "test@autopart.pro",
                            phone: "+7 (999) 123-45-67",
                            ...updates
                        }
                }));
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