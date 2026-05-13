// src/store/useProfileVehicleStore.ts
import { create } from "zustand";
import { toast } from "react-hot-toast";

import {
    getUserVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
} from "@/src/features/actions/vehicleActions";
import { Vehicle } from "@/src/types";

interface ProfileVehicleStore {
    vehicles: Vehicle[];
    isLoading: boolean;
    error: string | null;

    loadVehicles: () => Promise<void>;
    addVehicle: (data: any) => Promise<boolean>;
    updateVehicle: (id: string, updates: any) => Promise<boolean>;
    deleteVehicle: (id: string) => Promise<boolean>;
}

export const useProfileVehicleStore = create<ProfileVehicleStore>((set, get) => ({
    vehicles: [],
    isLoading: false,
    error: null,

    loadVehicles: async () => {
        set({ isLoading: true, error: null });

        try {
            const data = await getUserVehicles();
            set({ vehicles: data || [] });
        } catch (err: any) {
            console.error("Ошибка загрузки автомобилей:", err);
            set({ error: err.message });
            toast.error("Не удалось загрузить гараж");
        } finally {
            set({ isLoading: false });
        }
    },

    addVehicle: async (data) => {
        try {
            await addVehicle(data);
            await get().loadVehicles();           // обновляем список
            toast.success("Автомобиль успешно добавлен в гараж!");
            return true;
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Не удалось добавить автомобиль");
            return false;
        }
    },

    updateVehicle: async (id: string, updates: any) => {
        try {
            await updateVehicle(id, updates);
            await get().loadVehicles();
            toast.success("Автомобиль успешно обновлён!");
            return true;
        } catch (err: any) {
            console.error(err);
            toast.error("Не удалось обновить автомобиль");
            return false;
        }
    },

    deleteVehicle: async (id: string) => {
        try {
            await deleteVehicle(id);
            await get().loadVehicles();
            toast.success("Автомобиль удалён из гаража");
            return true;
        } catch (err: any) {
            console.error(err);
            toast.error("Не удалось удалить автомобиль");
            return false;
        }
    },
}));