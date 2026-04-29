// src/features/profile/hooks/useEditProfileForm.ts
"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/src/store/useAuthStore";
import { toast } from "react-hot-toast";

export function useEditProfileForm() {
    const { user, updateUser } = useAuthStore();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: "",
        phone: "",
    });

    // Заполняем форму данными пользователя
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                email: user.email,
            });
            setPreviewUrl(user.avatar || null);
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Очищаем ошибку при вводе
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // TODO: Загрузка в Supabase Storage позже
        console.log("📸 Выбран файл аватарки:", file.name);
    };

    const validateForm = (): boolean => {
        const newErrors = { name: "", phone: "" };

        if (!formData.name.trim()) {
            newErrors.name = "Имя обязательно";
        }

        setErrors(newErrors);
        return !newErrors.name;
    };

    const handleSubmit = async (e: React.FormEvent, onClose: () => void) => {
        e.preventDefault();
        if (!user) return;

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await updateUser({
                name: formData.name.trim(),
                phone: formData.phone.trim(),
            });

            toast.success("Профиль успешно обновлён! ✅");
            onClose();
        } catch (err) {
            toast.error("Не удалось сохранить изменения");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        errors,
        isLoading,
        previewUrl,
        handleChange,
        handleImageUpload,
        handleSubmit,
    };
}