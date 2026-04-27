// src/components/modals/AddVehicleModal.tsx
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
            <div className="bg-zinc-900 rounded-3xl w-full max-w-lg md:max-w-md border border-zinc-700 max-h-[95vh] overflow-hidden flex flex-col">
                {/* Заголовок */}
                <div className="flex items-center justify-between border-b border-zinc-700 px-5 sm:px-6 py-5 flex-shrink-0">
                    <h2 className="text-xl sm:text-2xl font-semibold">
                        {isEditMode ? "Редактировать автомобиль" : "Добавить автомобиль"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white p-2 -mr-2 transition-colors"
                    >
                        <X size={26} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6"
                >
                    {/* VIN */}
                    <div>
                        <label className="text-sm text-zinc-400 block mb-1.5">
                            VIN-код <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="vin"
                            value={formData.vin}
                            onChange={handleChange}
                            maxLength={17}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 font-mono uppercase text-base"
                            placeholder="WBA3A5C52EP608912"
                        />
                        {errors.vin && <p className="text-red-500 text-sm mt-1.5">{errors.vin}</p>}
                    </div>

                    {/* Марка + Модель */}
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
                            {errors.brand && <p className="text-red-500 text-sm mt-1.5">{errors.brand}</p>}
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
                                placeholder="3 Series (F30)"
                            />
                            {errors.model && <p className="text-red-500 text-sm mt-1.5">{errors.model}</p>}
                        </div>
                    </div>

                    {/* Год + Двигатель */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">
                                Год выпуска <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                maxLength={4}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base"
                                placeholder="2020"
                            />
                            {errors.year && <p className="text-red-500 text-sm mt-1.5">{errors.year}</p>}
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">Двигатель</label>
                            <input
                                type="text"
                                name="engine"
                                value={formData.engine}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base"
                                placeholder="2.0d (B47)"
                            />
                        </div>
                    </div>

                    {/* Номер кузова */}
                    <div>
                        <label className="text-sm text-zinc-400 block mb-1.5">Номер кузова (опционально)</label>
                        <input
                            type="text"
                            name="bodyNumber"
                            value={formData.bodyNumber}
                            onChange={handleChange}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base"
                            placeholder="3A5C52EP608912"
                        />
                    </div>

                    {/* Примечание */}
                    <div>
                        <label className="text-sm text-zinc-400 block mb-1.5">Примечание</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 resize-y text-base"
                            placeholder="Основная машина / Машина жены и т.д."
                        />
                    </div>

                    {/* Кнопка */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 py-4 sm:py-5 rounded-2xl font-medium text-lg transition-all active:scale-[0.985] mt-4"
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