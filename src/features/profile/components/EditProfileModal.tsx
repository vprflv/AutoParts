// src/app/profile/components/EditProfileModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Camera } from "lucide-react";
import { useAuthStore } from "@/src/store/useAuthStore";
import toast from "react-hot-toast";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
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

        // Очищаем ошибку при вводе
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    // Простая валидация
    const validateForm = (): boolean => {
        const newErrors = { email: "", phone: "" };
        let isValid = true;

        // Email
        if (!formData.email.trim()) {
            newErrors.email = "Email обязателен";
            isValid = false;
        } else if (!formData.email.includes("@")) {
            newErrors.email = "Введите корректный email";
            isValid = false;
        }

        // Телефон
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

    // Загрузка аватарки
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

    const handleSubmit = (e: React.FormEvent) => {
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
            onClose();
            setIsLoading(false);
        }, 700);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-md border border-zinc-700">
                <div className="flex items-center justify-between border-b border-zinc-700 px-6 py-5">
                    <h2 className="text-2xl font-semibold">Редактировать профиль</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Аватарка */}
                    <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                            <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-zinc-700">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-5xl font-bold">
                                        {formData.name?.[0] || "А"}
                                    </div>
                                )}
                            </div>

                            <label className="absolute -bottom-2 -right-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded-full p-3 cursor-pointer transition">
                                <Camera size={20} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Поля формы */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">Имя</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">Email <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full bg-zinc-800 border rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600 ${
                                    errors.email ? "border-red-500" : "border-zinc-700"
                                }`}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">Телефон <span className="text-red-500">*</span></label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full bg-zinc-800 border rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600 ${
                                    errors.phone ? "border-red-500" : "border-zinc-700"
                                }`}
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 py-4 rounded-2xl font-medium text-lg transition-all"
                    >
                        {isLoading ? "Сохраняем..." : "Сохранить изменения"}
                    </button>
                </form>
            </div>
        </div>
    );
}