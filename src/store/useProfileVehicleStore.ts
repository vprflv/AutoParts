// src/store/useProfileVehicleStore.ts
import { create } from "zustand";
import { createClient } from "@/src/lib/supabase/client";

import { useAuthStore } from "./useAuthStore";
import {toast} from "react-hot-toast";
import {Vehicle} from "@/src/types";

interface ProfileVehicleStore {
    vehicles: Vehicle[];
    isLoading: boolean;
    error: string | null;

    loadVehicles: () => Promise<void>;
    addVehicle: (data: Omit<Vehicle, "id" | "createdAt">) => Promise<boolean>;
    updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<boolean>;
    deleteVehicle: (id: string) => Promise<boolean>;
}

export const useProfileVehicleStore = create<ProfileVehicleStore>((set, get) => ({
    vehicles: [],
    isLoading: false,
    error: null,

    loadVehicles: async () => {
        set({ isLoading: true, error: null });

        const currentUser = useAuthStore.getState().user;
        if (!currentUser) {
            set({ vehicles: [], isLoading: false });
            return;
        }

        const supabase = createClient();

        try {
            const { data, error } = await supabase
                .from("vehicles")
                .select("*")
                .eq("user_id", currentUser.id)
                .order("created_at", { ascending: false });

            if (error) throw error;

            set({ vehicles: data || [] });
        } catch (err: any) {
            console.error("Ошибка загрузки автомобилей:", err);
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addVehicle: async (data) => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser) return false;

        const supabase = createClient();

        try {
            const { error } = await supabase
                .from("vehicles")
                .insert({
                    user_id: currentUser.id,
                    brand: data.brand,
                    model: data.model,
                    year: data.year,
                    engine: data.engine,
                    vin: data.vin,
                });

            if (error) throw error;

            await get().loadVehicles();
            toast.success("Автомобиль добавлен!");
            return true;
        } catch (err: any) {
            console.error("Ошибка добавления:", err);
            toast.error("Не удалось добавить автомобиль");
            return false;
        }
    },

    updateVehicle: async (id: string, updates) => {
        const supabase = createClient();
        try {
            const { error } = await supabase
                .from("vehicles")
                .update(updates)
                .eq("id", id);

            if (error) throw error;
            await get().loadVehicles();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    },

    deleteVehicle: async (id: string) => {
        const supabase = createClient();
        try {
            const { error } = await supabase
                .from("vehicles")
                .delete()
                .eq("id", id);

            if (error) throw error;
            await get().loadVehicles();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    },
}));