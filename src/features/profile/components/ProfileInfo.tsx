import { Edit2 } from "lucide-react";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import { User } from "@/src/types";

export default function ProfileInfo({ user }: { user: User }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <>
            <div className="max-w-2xl mx-auto px-1">
                <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                    {/* Аватарка — меньше на мобильных */}
                    <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex-shrink-0 overflow-hidden flex items-center justify-center text-4xl font-bold border-2 border-zinc-800">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            user.name?.[0]?.toUpperCase() || "?"
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl sm:text-3xl font-semibold truncate">
                            {user.name}
                        </h2>
                        <p className="text-zinc-400 text-base sm:text-lg truncate">
                            {user.email}
                        </p>

                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="mt-3 flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors text-sm sm:text-base active:scale-95"
                        >
                            <Edit2 size={18} />
                            Редактировать профиль
                        </button>
                    </div>
                </div>

                {/* Информационные блоки */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-zinc-800/50 rounded-2xl p-5 sm:p-6">
                        <p className="text-zinc-400 text-sm mb-1">Телефон</p>
                        <p className="text-lg sm:text-xl">
                            {user.phone || "+7 (999) 123-45-67"}
                        </p>
                    </div>

                    <div className="bg-zinc-800/50 rounded-2xl p-5 sm:p-6">
                        <p className="text-zinc-400 text-sm mb-1">Дата регистрации</p>
                        <p className="text-lg sm:text-xl">15 апреля 2026</p>
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