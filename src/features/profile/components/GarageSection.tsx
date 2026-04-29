// src/features/profile/components/GarageSection.tsx
"use client";

import { Car, Plus, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import AddVehicleModal from "./AddVehicleModal";

interface GarageSectionProps {
    vehicles: any[];
    onAddClick: () => void;
    onDeleteVehicle: (id: string) => void;     // ← добавили
}

export default function GarageSection({
                                          vehicles,
                                          onAddClick,
                                          onDeleteVehicle
                                      }: GarageSectionProps) {

    const [vehicleToEdit, setVehicleToEdit] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const openEditModal = (vehicle: any) => {
        setVehicleToEdit(vehicle);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setVehicleToEdit(null);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold">
                    Мой гараж ({vehicles.length})
                </h3>

                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-2xl text-sm font-medium transition-colors"
                >
                    <Plus size={20} />
                    Добавить автомобиль
                </button>
            </div>

            {vehicles.length === 0 ? (
                <div className="text-center py-20 text-zinc-400">
                    <Car size={60} className="mx-auto mb-4 opacity-40" />
                    <p className="text-xl">Гараж пока пуст</p>
                    <p className="text-sm mt-2">Добавьте свой автомобиль для быстрого подбора запчастей</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            className="bg-zinc-900 rounded-3xl p-6 border border-zinc-700 hover:border-zinc-600 transition-all"
                        >
                            <div>
                                <p className="text-xl font-bold">
                                    {vehicle.brand} {vehicle.model}
                                </p>
                                <p className="text-zinc-400 mt-1">
                                    {vehicle.year} год • {vehicle.engine}
                                </p>
                            </div>

                            {vehicle.vin && (
                                <div className="mt-4">
                                    <span className="text-xs text-zinc-500">VIN / Номер кузова</span>
                                    <p className="font-mono text-sm text-zinc-300 mt-0.5">
                                        {vehicle.vin}
                                    </p>
                                </div>
                            )}

                            <div className="mt-6 pt-6 border-t border-zinc-700 flex gap-3">
                                <button
                                    onClick={() => openEditModal(vehicle)}
                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-sm font-medium transition-colors"
                                >
                                    <Edit2 size={18} />
                                    Редактировать
                                </button>

                                <button
                                    onClick={() => {
                                        if (confirm(`Удалить ${vehicle.brand} ${vehicle.model}?`)) {
                                            onDeleteVehicle(vehicle.id);        // ← теперь работает
                                            toast.success("Автомобиль удалён из гаража");
                                        }
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-zinc-800 hover:bg-red-900/60 hover:text-red-400 rounded-2xl text-sm font-medium text-red-400 transition-colors"
                                >
                                    <Trash2 size={18} />
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddVehicleModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                vehicleToEdit={vehicleToEdit}
            />
        </>
    );
}