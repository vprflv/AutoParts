// src/app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useProfileStore } from "@/src/store/useProfileStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProfileInfo from "@/src/features/profile/components/ProfileInfo";
import GarageSection from "@/src/features/profile/components/GarageSection";
import OrdersList from "@/src/features/profile/components/OrdersList";
import WishlistSection from "@/src/features/profile/components/WishlistSection";
import AddressesSection from "@/src/features/profile/components/AddressesSection";
import AddVehicleModal from "@/src/features/profile/components/AddVehicleModal";



type Tab = "profile" | "orders" | "wishlist" | "addresses" | "garage";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);

    const { user, logout } = useAuthStore();
    const { vehicles, loadMockData } = useProfileStore();
    const router = useRouter();

    useEffect(() => {
        loadMockData();
    }, [loadMockData]);

    const currentUser = user || {
        id: "demo-user",
        name: "Алексей Петров",
        email: "test@autopart.pro",
        phone: "+7 (999) 123-45-67",
    };

    const handleLogout = () => {
        logout();
        toast.success("Вы успешно вышли из аккаунта");
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-zinc-950 pb-12">
            <div className="max-w-7xl mx-auto px-4 pt-8">
                {/* Заголовок */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-white">Личный кабинет</h1>
                        <p className="text-zinc-400 mt-2">
                            Добро пожаловать, {currentUser.name}
                            {!user && <span className="text-amber-400 text-sm ml-2">(Демо-режим)</span>}
                        </p>
                    </div>

                    {user && (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 mt-4 md:mt-0 text-red-400 hover:text-red-500 transition-colors"
                        >
                            Выйти
                        </button>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Навигация */}
                    <div className="lg:w-72 flex-shrink-0">
                        <div className="bg-zinc-900 rounded-3xl p-2 sticky top-6">
                            {[
                                { id: "profile", label: "Профиль", icon: "👤" },
                                { id: "garage", label: "Мой гараж", icon: "🚗" },
                                { id: "orders", label: "Мои заказы", icon: "📦" },
                                { id: "wishlist", label: "Избранное", icon: "❤️" },
                                { id: "addresses", label: "Адреса", icon: "📍" },
                            ].map(({ id, label, icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id as Tab)}
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

                    {/* Контент */}
                    <div className="flex-1 bg-zinc-900 rounded-3xl p-8 min-h-[700px]">
                        {activeTab === "profile" && <ProfileInfo user={currentUser} />}
                        {activeTab === "garage" && (
                            <GarageSection
                                vehicles={vehicles}
                                onAddClick={() => setIsAddVehicleModalOpen(true)}
                            />
                        )}
                        {activeTab === "orders" && <OrdersList />}
                        {activeTab === "wishlist" && <WishlistSection />}
                        {activeTab === "addresses" && <AddressesSection />}
                    </div>
                </div>
            </div>

            {/* Глобальная модалка добавления автомобиля */}
            <AddVehicleModal
                isOpen={isAddVehicleModalOpen}
                onClose={() => setIsAddVehicleModalOpen(false)}
            />
        </div>
    );
}