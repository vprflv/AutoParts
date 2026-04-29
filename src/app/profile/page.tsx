// src/app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import { useAuthStore } from "@/src/store/useAuthStore";
import { useProfileStore } from "@/src/store/useProfileStore";
import { useProfileVehicleStore } from "@/src/store/useProfileVehicleStore";

import ProfileInfo from "@/src/features/profile/components/ProfileInfo";
import GarageSection from "@/src/features/profile/components/GarageSection";
import OrdersList from "@/src/features/profile/components/OrdersList";
import AddVehicleModal from "@/src/features/profile/components/AddVehicleModal";

type Tab = "profile" | "garage" | "orders";

export default function ProfilePage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const tabFromUrl = searchParams.get("tab") as Tab | null;

    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);

    const { user, logout } = useAuthStore();
    const { loadOrders } = useProfileStore();
    const { vehicles, loadVehicles, deleteVehicle } = useProfileVehicleStore();

    // Загрузка данных
    useEffect(() => {
        loadOrders();
        loadVehicles();
    }, [loadOrders, loadVehicles]);

    // Синхронизация таба из URL
    useEffect(() => {
        if (tabFromUrl && ["profile", "garage", "orders"].includes(tabFromUrl)) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    const handleLogout = async () => {
        await logout();
        toast.success("Вы успешно вышли из аккаунта");
        router.push("/");
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-6">⏳</div>
                    <p className="text-zinc-400 mb-6">Загрузка профиля...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 pb-12">
            <div className="max-w-7xl mx-auto px-4 pt-6 md:pt-8">
                {/* Заголовок */}
                <div className="relative flex items-center justify-center mb-10 md:mb-12">
                    <button
                        onClick={() => router.push("/")}
                        className="absolute left-0 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={26} />
                        <span className="hidden sm:inline text-base">На главную</span>
                    </button>

                    <h3 className="text-3xl font-bold text-white tracking-tighter">
                        Личный кабинет
                    </h3>

                    <button
                        onClick={handleLogout}
                        className="absolute right-0 text-red-400 hover:text-red-500 transition-colors font-medium"
                    >
                        Выйти
                    </button>
                </div>

                {/* Мобильные табы */}
                <div className="md:hidden flex border-b border-zinc-800 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
                    {[
                        { id: "profile", label: "Профиль", icon: "👤" },
                        { id: "garage", label: "Гараж", icon: "🚗" },
                        { id: "orders", label: "Заказы", icon: "📦" },
                    ].map(({ id, label, icon }) => (
                        <button
                            key={id}
                            onClick={() => {
                                setActiveTab(id as Tab);
                                router.push(`/profile?tab=${id}`, { scroll: false });
                            }}
                            className={`flex-1 flex flex-col items-center py-3 px-4 rounded-xl transition-all whitespace-nowrap ${
                                activeTab === id
                                    ? "text-white bg-zinc-800"
                                    : "text-zinc-400 hover:text-zinc-200"
                            }`}
                        >
                            <span className="text-2xl mb-1">{icon}</span>
                            <span className="text-xs font-medium">{label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Десктопная навигация */}
                    <div className="hidden lg:block lg:w-72 flex-shrink-0">
                        <div className="bg-zinc-900 rounded-3xl p-2 sticky top-6">
                            {[
                                { id: "profile", label: "Профиль", icon: "👤" },
                                { id: "garage", label: "Мой гараж", icon: "🚗" },
                                { id: "orders", label: "Мои заказы", icon: "📦" },
                            ].map(({ id, label, icon }) => (
                                <button
                                    key={id}
                                    onClick={() => {
                                        setActiveTab(id as Tab);
                                        router.push(`/profile?tab=${id}`, { scroll: false });
                                    }}
                                    className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-left transition-all ${
                                        activeTab === id
                                            ? "bg-zinc-800 text-white"
                                            : "text-zinc-400 hover:bg-zinc-950 hover:text-zinc-200"
                                    }`}
                                >
                                    <span className="text-xl">{icon}</span>
                                    <span className="font-medium">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Основной контент */}
                    <div className="flex-1 bg-zinc-900 rounded-3xl p-5 md:p-8 min-h-[600px]">
                        {activeTab === "profile" && <ProfileInfo />}
                        {activeTab === "garage" && (
                            <GarageSection
                                vehicles={vehicles}
                                onAddClick={() => setIsAddVehicleModalOpen(true)}
                                onDeleteVehicle={deleteVehicle}
                            />
                        )}
                        {activeTab === "orders" && <OrdersList />}
                    </div>
                </div>
            </div>

            <AddVehicleModal
                isOpen={isAddVehicleModalOpen}
                onClose={() => setIsAddVehicleModalOpen(false)}
            />
        </div>
    );
}