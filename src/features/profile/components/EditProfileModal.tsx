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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-6">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-md border border-zinc-700 max-h-[94vh] overflow-hidden flex flex-col shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-950 flex-shrink-0">
                    <h2 className="text-2xl text-cyan-300 font-semibold tracking-tight">
                        Редактировать профиль
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white p-3 -mr-2 transition-all hover:scale-110"
                    >
                        <X size={28} className={"text-cyan-300 hover:text-blue-500"} />
                    </button>
                </div>

                <form
                    onSubmit={(e) => handleSubmit(e, onClose)}
                    className="flex-1 overflow-y-auto custom-scroll-purple p-6 space-y-6"
                >
                    {/*/!* Аватарка *!/*/}
                    {/*<div className="flex flex-col items-center">*/}
                    {/*    <div className="relative w-28 h-28 mb-4">*/}
                    {/*        <div className="w-full h-full rounded-3xl overflow-hidden border-4 border-zinc-700">*/}
                    {/*            {previewUrl || formData.avatar_url ? (*/}
                    {/*                <img*/}
                    {/*                    src={previewUrl || formData.avatar_url}*/}
                    {/*                    alt="Аватар"*/}
                    {/*                    className="w-full h-full object-cover"*/}
                    {/*                />*/}
                    {/*            ) : (*/}
                    {/*                <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-5xl font-bold text-white">*/}
                    {/*                    {formData.name?.[0]?.toUpperCase() || "?"}*/}
                    {/*                </div>*/}
                    {/*            )}*/}
                    {/*        </div>*/}

                    {/*        <label className="absolute bottom-1 right-1 bg-zinc-900 hover:bg-zinc-800 border border-cyan-500 p-2 rounded-full cursor-pointer transition-all hover:scale-110">*/}
                    {/*            <Camera className="w-5 h-5 text-cyan-400" />*/}
                    {/*            <input*/}
                    {/*                type="file"*/}
                    {/*                accept="image/*"*/}
                    {/*                onChange={handleImageUpload}*/}
                    {/*                className="hidden"*/}
                    {/*            />*/}
                    {/*        </label>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/* Поля формы */}
                    <div className="space-y-5">
                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">Имя</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                className={`w-full bg-zinc-800 border rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 text-base transition-all
                                    ${errors.name ? "border-red-500" : "border-zinc-700"}`}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1.5">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-1.5">Email</label>
                            <input
                                type="email"
                                value={formData.email || ''}
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
                                value={formData.phone || ''}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 text-base"
                                placeholder="+7 (999) 123-45-67"
                            />
                        </div>
                    </div>

                    {/* Кнопка сохранения */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-neon disabled:cursor-not-allowed disabled:opacity-50 mt-4"
                    >
                        {isLoading ? "Сохраняем изменения..." : "Сохранить изменения"}
                    </button>
                </form>
            </div>
        </div>
    );
}