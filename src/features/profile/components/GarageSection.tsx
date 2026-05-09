"use client";

import { Car, Plus, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import AddVehicleModal from "./AddVehicleModal";

interface GarageSectionProps {
    vehicles: any[];
    onAddClick: () => void;
    onDeleteVehicle: (id: string) => void;
}

export default function GarageSection({
                                          vehicles,
                                          onAddClick,
                                          onDeleteVehicle,
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
            <div className="flex justify-between gap-3 items-center mb-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold flex items-center gap-3">
                    <Car className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
                    Мой гараж

                </h3>

                <button
                    onClick={onAddClick}
                    className=" border-2 border-cyan-300 rounded-2xl inline-flex w-auto px-8 py-3 text-base"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Добавить автомобиль
                </button>
            </div>

            {vehicles.length === 0 ? (
                /* Пустое состояние гаража */
                <div className="text-center py-20 bg-zinc-900/50 border border-dashed border-zinc-700 rounded-3xl">
                    <div className="mx-auto w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                        <Car size={48} className="text-zinc-500" />
                    </div>
                    <p className="text-2xl font-medium text-zinc-300">Гараж пока пуст</p>
                    <p className="text-zinc-500 mt-3 max-w-xs mx-auto">
                        Добавьте свой автомобиль, чтобы получать точные рекомендации запчастей
                    </p>
                </div>
            ) : (
                /* Список автомобилей */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            className="group bg-zinc-900 border border-zinc-700 hover:border-cyan-500/40 rounded-3xl p-6 transition-all duration-300 hover:shadow-neon-main"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xl font-bold text-white">
                                        {vehicle.brand} {vehicle.model}
                                    </p>
                                    <p className="text-zinc-400 mt-1">
                                        {vehicle.year} год • {vehicle.engine}
                                    </p>
                                </div>

                                {vehicle.vin && (
                                    <div className="text-right">
                                        <span className="text-[10px] text-zinc-500 tracking-widest">VIN</span>
                                        <p className="font-mono text-xs text-zinc-400 mt-0.5">
                                            {vehicle.vin}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className=" mt-8 flex gap-3 text-xl sm:text-xl md:text-3xl">
                                <button
                                    onClick={() => openEditModal(vehicle)}
                                    className=" flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5
                   bg-zinc-800 hover:bg-zinc-700 rounded-2xl
                   text-sm sm:text-base text-cyan-300 font-medium transition-all active:scale-[0.97]"
                                >
                                    <Edit2 size={16} className="sm:hiden sm:w-5 sm:h-5" />
                                    <span className="hidden xs:inline">Редактировать</span>
                                    <span className="xs:hidden ">Изменить</span>
                                </button>

                                <button
                                    onClick={() => {
                                        if (confirm(`Удалить ${vehicle.brand} ${vehicle.model}?`)) {
                                            onDeleteVehicle(vehicle.id);
                                            toast.success("Автомобиль удалён из гаража");
                                        }
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-zinc-800 hover:bg-red-900/60 hover:text-red-400 rounded-2xl text-sm font-medium text-red-400 transition-all active:scale-[0.97]"
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