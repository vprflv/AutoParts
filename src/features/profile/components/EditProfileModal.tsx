// src/app/profile/components/EditProfileModal.tsx
"use client";

import { X, Camera } from "lucide-react";
import { useEditProfileForm } from "@/src/features/profile/hooks/useEditProfileForm";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
    const {
        formData,
        errors,
        isLoading,
        previewUrl,
        handleChange,
        handleImageUpload,
        handleSubmit,
    } = useEditProfileForm();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-md border border-zinc-700 max-h-[95vh] overflow-hidden flex flex-col">
                {/* Заголовок */}
                <div className="flex items-center justify-between border-b border-zinc-700 px-5 sm:px-6 py-5 flex-shrink-0">
                    <h2 className="text-xl sm:text-2xl font-semibold">Редактировать профиль</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white p-2 -mr-2 transition-colors active:scale-90"
                    >
                        <X size={26} />
                    </button>
                </div>

                <form
                    onSubmit={(e) => handleSubmit(e, onClose)}
                    className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6"
                >


                    {/* Поля формы */}
                    <div className="space-y-5">
                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">Имя</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full bg-zinc-800 border rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-blue-600 ${
                                    errors.name ? "border-red-500" : "border-zinc-700"
                                }`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1.5">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-base opacity-60 cursor-not-allowed"
                            />
                            <p className="text-xs text-zinc-500 mt-1">Email изменить нельзя</p>
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">Телефон</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-blue-600"
                                placeholder="+7 (999) 123-45-67"
                            />
                        </div>
                    </div>

                    {/* Кнопка сохранения */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 py-4 rounded-2xl font-medium text-lg transition-all active:scale-[0.985]"
                    >
                        {isLoading ? "Сохраняем..." : "Сохранить изменения"}
                    </button>
                </form>
            </div>
        </div>
    );
}