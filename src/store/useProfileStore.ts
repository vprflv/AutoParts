// src/store/useProfileStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Vehicle {
    id: string;
    vin: string;
    bodyNumber?: string;
    brand: string;
    model: string;
    year: number;
    engine?: string;
    isDefault: boolean;
    notes?: string;
}

export const useProfileStore = create(
    persist(
        (set, get) => ({
            addresses: [],
            orders: [],
            wishlist: [],
            vehicles: [],

            loadMockData: () => {
                const currentVehicles = get().vehicles;

                if (currentVehicles.length === 0) {
                    console.log("🚀 Загружаем мок-данные для гаража"); // для отладки
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

            addVehicle: (vehicle: any) =>
                set((state: any) => ({
                    vehicles: [...state.vehicles, { ...vehicle, id: "veh_" + Date.now() }],
                })),
            setDefaultVehicle: (id: string) =>
                set((state: any) => ({
                    vehicles: state.vehicles.map((v: any) => ({
                        ...v,
                        isDefault: v.id === id,
                    })),
                })),
            updateVehicle: (id: string, updates: any) =>
                set((state: any) => ({
                    vehicles: state.vehicles.map((v: any) =>
                        v.id === id ? { ...v, ...updates } : v
                    ),
                })),

            deleteVehicle: (id: string) =>
                set((state: any) => ({
                    vehicles: state.vehicles.filter((v: any) => v.id !== id),
                })),

        }),

        {
            name: "profile-storage",
        }
    )
);