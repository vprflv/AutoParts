// src/components/modals/AddVehicleModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { z } from "zod";
import { useProfileStore } from "@/src/store/useProfileStore";
import toast from "react-hot-toast";

const vehicleSchema = z.object({
    vin: z.string().length(17, "VIN должен содержать ровно 17 символов"),
    bodyNumber: z.string().optional(),
    brand: z.string().min(1, "Укажите марку автомобиля"),
    model: z.string().min(1, "Укажите модель автомобиля"),
    year: z.string().length(4, "Год должен состоять из 4 цифр"),
    engine: z.string().optional(),
    notes: z.string().optional(),
});

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicleToEdit?: any;
}

export default function AddVehicleModal({ isOpen, onClose, vehicleToEdit }: AddVehicleModalProps) {
    const [formData, setFormData] = useState({
        vin: "",
        bodyNumber: "",
        brand: "",
        model: "",
        year: new Date().getFullYear().toString(),
        engine: "",
        notes: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const { addVehicle, updateVehicle } = useProfileStore();
    const isEditMode = !!vehicleToEdit;

    // Заполняем форму при редактировании
    useEffect(() => {
        if (vehicleToEdit && isOpen) {
            setFormData({
                vin: vehicleToEdit.vin || "",
                bodyNumber: vehicleToEdit.bodyNumber || "",
                brand: vehicleToEdit.brand || "",
                model: vehicleToEdit.model || "",
                year: vehicleToEdit.year?.toString() || "",
                engine: vehicleToEdit.engine || "",
                notes: vehicleToEdit.notes || "",
            });
        }
    }, [vehicleToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const validated = vehicleSchema.parse(formData);

            const vehicleData = {
                ...validated,
                year: parseInt(validated.year),
            };

            if (isEditMode && vehicleToEdit?.id) {
                updateVehicle(vehicleToEdit.id, vehicleData);
                toast.success("Автомобиль успешно обновлён!");
            } else {
                addVehicle({ ...vehicleData, isDefault: false });
                toast.success("Автомобиль успешно добавлен в гараж!");
            }

            onClose();
        } catch (err: any) {
            const newErrors: Record<string, string> = {};
            err.errors?.forEach((error: any) => {
                newErrors[error.path[0]] = error.message;
            });
            setErrors(newErrors);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-lg border border-zinc-700">
                {/* Заголовок */}
                <div className="flex items-center justify-between border-b border-zinc-700 px-6 py-5">
                    <h2 className="text-2xl font-semibold">
                        {isEditMode ? "Редактировать автомобиль" : "Добавить автомобиль"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600 font-mono uppercase"
                            placeholder="WBA3A5C52EP608912"
                        />
                        {errors.vin && <p className="text-red-500 text-sm mt-1">{errors.vin}</p>}
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
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
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
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
                                placeholder="3 Series (F30)"
                            />
                            {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
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
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
                                placeholder="2020"
                            />
                            {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">Двигатель</label>
                            <input
                                type="text"
                                name="engine"
                                value={formData.engine}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
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
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
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
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600 resize-y"
                            placeholder="Основная машина / Машина жены и т.д."
                        />
                    </div>

                    {/* Кнопка отправки */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 py-4 rounded-2xl font-medium text-lg transition-all mt-6"
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