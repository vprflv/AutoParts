"use client";

import { Edit2 } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/src/store/useAuthStore";
import EditProfileModal from "./EditProfileModal";

export default function ProfileInfo() {
    const { user } = useAuthStore();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-20 sm:py-32 text-zinc-400 min-h-[400px]">
                <div className="text-5xl sm:text-6xl mb-6">⏳</div>
                <p className=" text-cyan-300 text-lg ">Загрузка профиля...</p>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                {/* Основная информация */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-10">
                    {/* Аватарка */}
                    <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex-shrink-0 overflow-hidden border-4 border-zinc-800 shadow-neon-main flex items-center justify-center text-5xl font-bold">
                        {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || "?"}
                    </div>

                    {/* Информация */}
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            {user.name || "Пользователь"}
                        </h2>
                        <p className="text-zinc-400 text-lg mt-1">
                            {user.email}
                        </p>

                        {user.telegram_id && (
                            <p className="text-cyan-400 text-sm mt-1">
                                @{user.username || 'telegram'}
                            </p>
                        )}

                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-sm font-medium transition-all active:scale-95"
                        >
                            <Edit2 size={18} />
                            Редактировать профиль
                        </button>
                    </div>
                </div>

                {/* Инфо карточки */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-cyan-500/30 transition-colors">
                        <p className="text-zinc-400 text-sm mb-1">Телефон</p>
                        <p className="text-xl font-medium text-white mt-1">
                            {user.phone || "Не указан"}
                        </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-cyan-500/30 transition-colors">
                        <p className="text-zinc-400 text-sm mb-1">Дата регистрации</p>
                        <p className="text-xl font-medium text-white mt-1">
                            15 апреля 2026
                        </p>
                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </>
    );
}