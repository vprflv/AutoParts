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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-6">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-md border border-zinc-700 max-h-[94vh] overflow-hidden flex flex-col shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5 bg-zinc-950 flex-shrink-0">
                    <h2 className="text-2xl text-cyan-300 font-semibold tracking-tight">
                        {isEditMode ? "Редактировать автомобиль" : "Добавить автомобиль"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white p-3 -mr-2 transition-all hover:scale-110"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Форма */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto custom-scroll-purple p-6 space-y-6"
                >
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
                                className={`w-full bg-zinc-800 border rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 text-base transition-all
                                    ${errors.brand ? "border-red-500" : "border-zinc-700"}`}
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
                                className={`w-full bg-zinc-800 border rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 text-base transition-all
                                    ${errors.model ? "border-red-500" : "border-zinc-700"}`}
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
                                className={`w-full bg-zinc-800 border rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 text-base transition-all
                                    ${errors.year ? "border-red-500" : "border-zinc-700"}`}
                                placeholder="2022"
                            />
                            {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">
                                Двигатель <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="engine"
                                value={formData.engine}
                                onChange={handleChange}
                                className={`w-full bg-zinc-800 border rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 text-base transition-all
                                    ${errors.engine ? "border-red-500" : "border-zinc-700"}`}
                                placeholder="3.0d"
                            />
                            {errors.engine && <p className="text-red-500 text-sm mt-1">{errors.engine}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-zinc-400 block mb-1.5">
                            VIN / Номер кузова
                        </label>
                        <input
                            type="text"
                            name="vin"
                            value={formData.vin}
                            onChange={handleChange}
                            maxLength={17}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 font-mono uppercase tracking-wider text-base"
                            placeholder="WBA12345678901234"
                        />
                    </div>

                    {/* Кнопка */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-neon disabled:cursor-not-allowed disabled:opacity-50 mt-4"
                    >
                        {isLoading
                            ? isEditMode
                                ? "Сохраняем изменения..."
                                : "Добавляем автомобиль..."
                            : isEditMode
                                ? "Сохранить изменения"
                                : "Добавить в гараж"}
                    </button>
                </form>
            </div>
        </div>
    );
}