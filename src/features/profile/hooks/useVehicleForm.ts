// src/features/profile/hooks/useVehicleForm.ts
import { useState, useEffect } from "react";
import { z } from "zod";
import toast from "react-hot-toast";
import {useProfileVehicleStore} from "@/src/store/useProfileVehicleStore";

const vehicleSchema = z.object({
    vin: z.string().length(17, "VIN должен содержать ровно 17 символов"),
    bodyNumber: z.string().optional(),
    brand: z.string().min(1, "Укажите марку автомобиля"),
    model: z.string().min(1, "Укажите модель автомобиля"),
    year: z.string().length(4, "Год должен состоять из 4 цифр"),
    engine: z.string().optional(),
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
                addVehicle({ ...vehicleData, isDefault: false });
                toast.success("Автомобиль успешно добавлен в гараж!");
            }

            // ✅ Закрываем модалку после успешного действия
            onSuccess?.();
            return true;
        } catch (err: any) {
            const newErrors: Record<string, string> = {};
            const issues = err.issues || err.errors || [];

            issues.forEach((issue: any) => {
                if (issue.path?.[0]) {
                    newErrors[issue.path[0]] = issue.message;
                }
            });

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