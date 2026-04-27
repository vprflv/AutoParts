// src/store/useProfileVehicleStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {Vehicle} from "@/src/types";



interface VehicleStore {
    vehicles: Vehicle[];

    loadMockVehicles: () => void;
    addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
    updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
    deleteVehicle: (id: string) => void;
    setDefaultVehicle: (id: string) => void;
}

export const useProfileVehicleStore = create<VehicleStore>()(
    persist(
        (set, get) => ({
            vehicles: [],

            loadMockVehicles: () => {
                if (get().vehicles.length === 0) {
                    console.log("🚀 Загружаем мок-данные автомобилей");
                    set({
                        vehicles: [
                            {
                                id: "veh_1",
                                vin: "WBA3A5C52EP608912",
                                bodyNumber: "3A5C52EP608912",
                                brand: "BMW",
                                model: "3 Series (F30)",
                                year: 2020,
                                engine: "2.0d (B47)",
                                isDefault: true,
                                notes: "Основная машина",
                            },
                            {
                                id: "veh_2",
                                vin: "VF3CA5FU8DJ123456",
                                bodyNumber: "",
                                brand: "Peugeot",
                                model: "308",
                                year: 2022,
                                engine: "1.5 BlueHDi",
                                isDefault: false,
                                notes: "Машина жены",
                            },
                        ],
                    });
                }
            },

            addVehicle: (vehicle) =>
                set((state) => ({
                    vehicles: [...state.vehicles, { ...vehicle, id: "veh_" + Date.now() } as Vehicle],
                })),

            updateVehicle: (id, updates) =>
                set((state) => ({
                    vehicles: state.vehicles.map((v) =>
                        v.id === id ? { ...v, ...updates } : v
                    ),
                })),

            deleteVehicle: (id) =>
                set((state) => ({
                    vehicles: state.vehicles.filter((v) => v.id !== id),
                })),

            setDefaultVehicle: (id) =>
                set((state) => ({
                    vehicles: state.vehicles.map((v) => ({
                        ...v,
                        isDefault: v.id === id,
                    })),
                })),
        }),

        {
            name: "vehicle-storage",
        }
    )
);