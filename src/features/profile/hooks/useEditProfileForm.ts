// src/features/profile/hooks/useEditProfileForm.ts
import { useState, useEffect } from "react";
import { useAuthStore } from "@/src/store/useAuthStore";
import toast from "react-hot-toast";

export function useEditProfileForm() {
    const { user, updateUser } = useAuthStore();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        avatar: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        phone: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    // Заполняем данные при открытии
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "+7 (999) 123-45-67",
                avatar: user.avatar || "",
            });
            setPreviewUrl(user.avatar || "");
            setErrors({ email: "", phone: "" });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    // Простая валидация
    const validateForm = (): boolean => {
        const newErrors = { email: "", phone: "" };
        let isValid = true;

        if (!formData.email.trim()) {
            newErrors.email = "Email обязателен";
            isValid = false;
        } else if (!formData.email.includes("@")) {
            newErrors.email = "Введите корректный email";
            isValid = false;
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Телефон обязателен";
            isValid = false;
        } else if (formData.phone.length < 10) {
            newErrors.phone = "Введите корректный номер телефона";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Пожалуйста, загрузите изображение");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            setPreviewUrl(base64);
            setFormData(prev => ({ ...prev, avatar: base64 }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent, onSuccess?: () => void) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        setTimeout(() => {
            updateUser({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                avatar: formData.avatar || undefined,
            });

            toast.success("Профиль успешно обновлён!");
            onSuccess?.();
            setIsLoading(false);
        }, 700);
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