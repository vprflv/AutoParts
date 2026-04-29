"use client";

import { X } from "lucide-react";
import { useVehicleForm } from "@/src/features/profile/hooks/useVehicleForm";

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicleToEdit?: any;
}

export default function AddVehicleModal({
                                            isOpen,
                                            onClose,
                                            vehicleToEdit,
                                        }: AddVehicleModalProps) {
    const {
        formData,
        errors,
        isLoading,
        isEditMode,
        handleChange,
        handleSubmit,
    } = useVehicleForm(vehicleToEdit, onClose);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-lg border border-zinc-700 max-h-[95vh] overflow-hidden flex flex-col">
                {/* Заголовок */}
                <div className="flex items-center justify-between border-b border-zinc-700 px-6 py-5 flex-shrink-0">
                    <h2 className="text-xl sm:text-2xl font-semibold">
                        {isEditMode ? "Редактировать автомобиль" : "Добавить автомобиль"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white p-2 transition-colors"
                    >
                        <X size={26} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">
                                Марка <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base"
                                placeholder="BMW"
                            />
                            {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">
                                Модель <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base"
                                placeholder="X5"
                            />
                            {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">
                                Год <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base"
                                placeholder="2022"
                            />
                            {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">Двигатель <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="engine"
                                value={formData.engine}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base"
                                placeholder="3.0d"
                            />
                            {errors.engine && <p className="text-red-500 text-sm mt-1">{errors.engine}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-zinc-400 block mb-1.5">VIN / Номер кузова</label>
                        <input
                            type="text"
                            name="vin"
                            value={formData.vin}
                            onChange={handleChange}
                            maxLength={17}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 font-mono uppercase text-base"
                            placeholder="WBA12345678901234"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 py-4 rounded-2xl font-medium text-lg transition-all active:scale-[0.985]"
                    >
                        {isLoading
                            ? (isEditMode ? "Сохраняем изменения..." : "Добавляем автомобиль...")
                            : (isEditMode ? "Сохранить изменения" : "Добавить в гараж")
                        }
                    </button>
                </form>
            </div>
        </div>
    );
}