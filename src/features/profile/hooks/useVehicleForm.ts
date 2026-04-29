// src/features/profile/hooks/useVehicleForm.ts
import { useState, useEffect } from "react";
import { z } from "zod";
import toast from "react-hot-toast";
import { useProfileVehicleStore } from "@/src/store/useProfileVehicleStore";

const vehicleSchema = z.object({
    brand: z.string().min(1, "Укажите марку автомобиля"),
    model: z.string().min(1, "Укажите модель автомобиля"),
    year: z.string()
        .length(4, "Год должен состоять из 4 цифр")
        .regex(/^\d{4}$/, "Год должен быть числом"),
    engine: z.string().min(1, "Укажите двигатель"),
    vin: z.string()
        .optional()
        .refine((val) => !val || val.length === 17, "VIN должен содержать 17 символов"),
});

export function useVehicleForm(vehicleToEdit?: any, onSuccess?: () => void) {
    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        year: new Date().getFullYear().toString(),
        engine: "",
        vin: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = !!vehicleToEdit;

    const { addVehicle, updateVehicle } = useProfileVehicleStore();

    // Заполнение при редактировании
    useEffect(() => {
        if (vehicleToEdit) {
            setFormData({
                brand: vehicleToEdit.brand || "",
                model: vehicleToEdit.model || "",
                year: vehicleToEdit.year?.toString() || "",
                engine: vehicleToEdit.engine || "",
                vin: vehicleToEdit.vin || "",
            });
        }
    }, [vehicleToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("🚀 handleSubmit started", formData);

        setIsLoading(true);
        setErrors({});

        try {
            const validated = vehicleSchema.parse(formData);
            console.log("✅ Валидация прошла");

            const vehicleData = {
                brand: validated.brand.trim(),
                model: validated.model.trim(),
                year: parseInt(validated.year),
                engine: validated.engine.trim(),
                vin: validated.vin?.trim() || undefined,
            };

            console.log("📤 Отправляем данные:", vehicleData);

            let success = false;

            if (isEditMode && vehicleToEdit?.id) {
                success = await updateVehicle(vehicleToEdit.id, vehicleData);
            } else {
                success = await addVehicle(vehicleData);
            }

            console.log("Результат операции:", success);

            if (success) {
                toast.success(isEditMode ? "Автомобиль обновлён!" : "Автомобиль добавлен!");
                onSuccess?.();
            }
        } catch (err: any) {
            console.error("❌ Ошибка в handleSubmit:", err);
            // ... обработка ошибок
        } finally {
            setIsLoading(false);
            console.log("🏁 handleSubmit finished");
        }
    };

    return {
        formData,
        errors,
        isLoading,
        isEditMode,
        handleChange,
        handleSubmit,
    };
}