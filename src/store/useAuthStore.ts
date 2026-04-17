import { create } from "zustand";

interface AuthStore {
    user: { id: string; name: string; email: string } | null;
    login: (email: string, password: string) => boolean;
    register: (name: string, email: string, password: string) => boolean;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    login: (email, password) => {
        // Здесь можно добавить реальную авторизацию (NextAuth, Clerk и т.д.)
        if (email && password) {
            set({ user: { id: "1", name: "Иван Иванов", email } });
            return true;
        }
        return false;
    },
    register: (name, email, password) => {
        set({ user: { id: "1", name, email } });
        return true;
    },
    logout: () => set({ user: null }),
}));