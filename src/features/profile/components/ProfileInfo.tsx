// src/app/profile/components/ProfileInfo.tsx
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
                <p className="text-lg">Загрузка профиля...</p>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-2xl mx-auto px-4 sm:px-1">
                {/* Основная информация */}
                <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex-shrink-0 overflow-hidden flex items-center justify-center text-5xl sm:text-6xl font-bold border-2 border-zinc-800">
                        {user.name?.[0]?.toUpperCase() || "?"}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl sm:text-3xl font-semibold truncate">
                            {user.name || "Пользователь"}
                        </h2>
                        <p className="text-zinc-400 text-base sm:text-lg truncate mt-0.5">
                            {user.email}
                        </p>

                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="mt-4 flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors text-sm sm:text-base active:scale-95 py-1"
                        >
                            <Edit2 size={18} className="sm:w-5 sm:h-5" />
                            Редактировать профиль
                        </button>
                    </div>
                </div>

                {/* Инфо карточки */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-zinc-800/50 rounded-2xl p-5 sm:p-6">
                        <p className="text-zinc-400 text-sm mb-1.5">Телефон</p>
                        <p className="text-lg sm:text-xl font-medium">
                            {user.phone || "Не указан"}
                        </p>
                    </div>

                    <div className="bg-zinc-800/50 rounded-2xl p-5 sm:p-6">
                        <p className="text-zinc-400 text-sm mb-1.5">Дата регистрации</p>
                        <p className="text-lg sm:text-xl font-medium">15 апреля 2026</p>
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