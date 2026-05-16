// src/features/profile/hooks/useVehicleForm.ts
import { useState, useEffect } from "react";
import { z } from "zod";
import toast from "react-hot-toast";
import { useProfileVehicleStore } from "@/src/store/useProfileVehicleStore";

// Упрощённая схема — только обязательные поля
const vehicleSchema = z.object({
    brand: z.string().min(1, "Укажите марку автомобиля"),
    model: z.string().min(1, "Укажите модель автомобиля"),
    year: z.string()
        .min(4, "Год должен содержать 4 цифры")
        .max(4, "Год должен содержать 4 цифры")
        .regex(/^\d{4}$/, "Год должен состоять только из 4 цифр"),

    // VIN и engine — полностью опциональные
    vin: z.string().optional(),
    engine: z.string().optional(),
    bodyNumber: z.string().optional(),
    notes: z.string().optional(),
});

export function useVehicleForm(vehicleToEdit?: any, onSuccess?: () => void) {
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
    const isEditMode = !!vehicleToEdit;

    const { addVehicle, updateVehicle } = useProfileVehicleStore();

    useEffect(() => {
        if (vehicleToEdit) {
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
    }, [vehicleToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
                addVehicle(vehicleData);
                toast.success("Автомобиль успешно добавлен в гараж!");
            }

            onSuccess?.();
            return true;
        } catch (err: any) {
            const newErrors: Record<string, string> = {};

            if (err.issues) {
                err.issues.forEach((issue: any) => {
                    const field = issue.path[0] as string;
                    if (field) newErrors[field] = issue.message;
                });
            }

            setErrors(newErrors);
            return false;
        } finally {
            setIsLoading(false);
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