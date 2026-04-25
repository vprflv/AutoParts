"use client";

import { useState } from "react";
import { Car, Plus, Edit2 } from "lucide-react";
import { useProfileStore } from "@/src/store/useProfileStore";
import toast from "react-hot-toast";
import AddVehicleModal from "./AddVehicleModal";

export default function GarageSection({
                                          vehicles,
                                          onAddClick
                                      }: {
    vehicles: any[];
    onAddClick: () => void;   // ← для открытия модалки добавления
}) {
    const { setDefaultVehicle, deleteVehicle } = useProfileStore();

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
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-semibold">Мой гараж ({vehicles.length})</h3>
                <button
                    onClick={onAddClick}          // ← должна работать
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-2xl text-sm font-medium transition"
                >
                    <Plus size={20} />
                    Добавить автомобиль
                </button>
            </div>

            {vehicles.length === 0 ? (
                <div className="text-center py-20 text-zinc-400">
                    <Car size={48} className="mx-auto mb-4 opacity-40" />
                    <p className="text-lg">В гараже пока нет автомобилей</p>
                    <p className="text-sm mt-2">Добавьте своё ТС для быстрого подбора запчастей</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            className="bg-zinc-800/50 rounded-3xl p-7 hover:bg-zinc-800 transition-all group border border-zinc-700/50"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <p className="text-2xl font-bold">
                                            {vehicle.brand} {vehicle.model}
                                        </p>
                                        {vehicle.isDefault && (
                                            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-medium">
                                                Основной
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-zinc-400 mt-1">{vehicle.year} год</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-zinc-500 uppercase tracking-widest">VIN</p>
                                    <p className="font-mono text-sm">{vehicle.vin}</p>
                                </div>
                            </div>

                            {vehicle.bodyNumber && (
                                <div className="mt-4 text-sm">
                                    <span className="text-zinc-500">Номер кузова: </span>
                                    <span className="font-mono">{vehicle.bodyNumber}</span>
                                </div>
                            )}

                            {vehicle.engine && (
                                <div className="mt-3 text-sm">
                                    <span className="text-zinc-500">Двигатель: </span>
                                    <span>{vehicle.engine}</span>
                                </div>
                            )}

                            {vehicle.notes && (
                                <p className="text-xs text-zinc-400 mt-4 italic">«{vehicle.notes}»</p>
                            )}

                            <div className="mt-6 pt-6 border-t border-zinc-700 flex flex-wrap gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                {!vehicle.isDefault && (
                                    <button
                                        onClick={() => {
                                            setDefaultVehicle(vehicle.id);
                                            toast.success(`${vehicle.brand} ${vehicle.model} — теперь основной`);
                                        }}
                                        className="text-emerald-400 hover:text-emerald-500 text-sm font-medium"
                                    >
                                        ⭐ Сделать основным
                                    </button>
                                )}

                                <button
                                    onClick={() => openEditModal(vehicle)}
                                    className="text-blue-400 hover:text-blue-500 text-sm font-medium flex items-center gap-1.5"
                                >
                                    <Edit2 size={16} /> Редактировать
                                </button>

                                <button
                                    onClick={() => {
                                        if (confirm(`Удалить ${vehicle.brand} ${vehicle.model}?`)) {
                                            deleteVehicle(vehicle.id);
                                            toast.success("Автомобиль удалён");
                                        }
                                    }}
                                    className="text-red-400 hover:text-red-500 text-sm font-medium"
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Модалка редактирования */}
            <AddVehicleModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                vehicleToEdit={vehicleToEdit}
            />
        </>
    );
}