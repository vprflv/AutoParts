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
                <div className="flex items-center justify-between border-b border-zinc-700 px-5 sm:px-6 py-4 sm:py-5 flex-shrink-0">
                    <h2 className="text-lg sm:text-2xl font-semibold">Редактировать профиль</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white p-2 -mr-2 transition-colors active:scale-90"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form
                    onSubmit={(e) => handleSubmit(e, onClose)}
                    className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6"
                >
                    {/* Аватарка */}
                    <div className="flex flex-col items-center">
                        <div className="relative mb-6">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-zinc-700">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-5xl sm:text-6xl font-bold">
                                        {formData.name?.[0]?.toUpperCase() || "А"}
                                    </div>
                                )}
                            </div>

                            {/* Кнопка загрузки фото */}
                            <label className="absolute -bottom-2 -right-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded-full p-2.5 sm:p-3 cursor-pointer transition-all active:scale-90 shadow-lg">
                                <Camera size={20} className="sm:w-[22px] sm:h-[22px]" />
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
                    <div className="space-y-5">
                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">Имя</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full bg-zinc-800 border rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-blue-600 ${
                                    errors.email ? "border-red-500" : "border-zinc-700"
                                }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">
                                Телефон <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full bg-zinc-800 border rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-blue-600 ${
                                    errors.phone ? "border-red-500" : "border-zinc-700"
                                }`}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1.5">{errors.phone}</p>
                            )}
                        </div>
                    </div>

                    {/* Кнопка сохранения */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 py-4 sm:py-5 rounded-2xl font-medium text-lg active:scale-[0.985] transition-all mt-2"
                    >
                        {isLoading ? "Сохраняем..." : "Сохранить изменения"}
                    </button>
                </form>
            </div>
        </div>
    );
}