import { Edit2 } from "lucide-react";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import {User} from "@/src/types";

export default function ProfileInfo({ user }: { user: User }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <>
            <div className="max-w-2xl">
                <div className="flex items-center gap-6 mb-10">
                    <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-5xl font-bold">
                        {<img src={user.avatar as string} alt="Avatar" className="w-full h-full object-cover" />|| user.name[0]}
                    </div>
                    <div>
                        <h2 className="text-3xl font-semibold">{user.name}</h2>
                        <p className="text-zinc-400 text-lg">{user.email}</p>
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="mt-3 flex items-center gap-2 text-blue-500 hover:text-blue-400"
                        >
                            <Edit2 size={18} />
                            Редактировать профиль
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-800/50 rounded-2xl p-6">
                        <p className="text-zinc-400 text-sm mb-1">Телефон</p>
                        <p className="text-lg">{user.phone || "+7 (999) 123-45-67"}</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-2xl p-6">
                        <p className="text-zinc-400 text-sm mb-1">Дата регистрации</p>
                        <p className="text-lg">15 апреля 2026</p>
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