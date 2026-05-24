// src/store/useAdminStore.ts
import { create } from 'zustand';

type AdminUser = {
    id: string;
    email: string;
    name?: string;
    role: string;
};

interface AdminStore {
    adminUser: AdminUser | null;
    setAdminUser: (user: AdminUser | null) => void;
    clearAdminUser: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
    adminUser: null,
    setAdminUser: (user) => set({ adminUser: user }),
    clearAdminUser: () => set({ adminUser: null }),
}));