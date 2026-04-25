"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useProfileStore } from "@/src/store/useProfileStore";
import { User, Package, Heart, MapPin, Car, LogOut, Edit2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AddVehicleModal from "@/src/features/profile/components/AddVehicleModal";

type Tab = "profile" | "orders" | "wishlist" | "addresses" | "garage";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);

    const { user, logout } = useAuthStore();
    const { orders, addresses, wishlist, vehicles, loadMockOrders, loadMockData } = useProfileStore();
    const router = useRouter();

    useEffect(() => {
        // if (orders.length === 0) loadMockOrders?.();
        loadMockData();                    // ← обязательно
    }, [loadMockOrders, loadMockData]);

    const currentUser = user || {
        id: "mock-user",
        name: "Алексей Петров",
        email: "test@autopart.pro",
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
                            <LogOut size={20} />
                            <span>Выйти</span>
                        </button>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Навигация по вкладкам */}
                    <div className="lg:w-72 flex-shrink-0">
                        <div className="bg-zinc-900 rounded-3xl p-2 sticky top-6">
                            {[
                                { id: "profile", label: "Профиль", icon: User },
                                { id: "garage", label: "Мой гараж", icon: Car },
                                { id: "orders", label: "Мои заказы", icon: Package },
                                { id: "wishlist", label: "Избранное", icon: Heart },
                                { id: "addresses", label: "Адреса доставки", icon: MapPin },
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id as Tab)}
                                    className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-left transition-all ${
                                        activeTab === id
                                            ? "bg-zinc-800 text-white"
                                            : "text-zinc-400 hover:bg-zinc-950 hover:text-zinc-200"
                                    }`}
                                >
                                    <Icon size={22} />
                                    <span className="font-medium">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Основной контент */}
                    <div className="flex-1 bg-zinc-900 rounded-3xl p-8 min-h-[700px]">
                        {activeTab === "profile" && <ProfileInfo user={currentUser} />}
                        {activeTab === "garage" && <GarageSection vehicles={vehicles} onAddClick={() => setIsAddVehicleModalOpen(true)}  />}
                        {activeTab === "orders" && <OrdersList orders={orders} />}
                        {activeTab === "wishlist" && <WishlistSection wishlist={wishlist} />}
                        {activeTab === "addresses" && <AddressesSection addresses={addresses} />}
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

/* ====================== Компоненты вкладок ====================== */

function ProfileInfo({ user }: { user: any }) {
    return (
        <div className="max-w-2xl">
            <div className="flex items-center gap-6 mb-10">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-5xl font-bold">
                    {user.name[0]}
                </div>
                <div>
                    <h2 className="text-3xl font-semibold">{user.name}</h2>
                    <p className="text-zinc-400 text-lg">{user.email}</p>
                    <button className="mt-3 flex items-center gap-2 text-blue-500 hover:text-blue-400">
                        <Edit2 size={18} />
                        Редактировать профиль
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-800/50 rounded-2xl p-6">
                    <p className="text-zinc-400 text-sm mb-1">Телефон</p>
                    <p className="text-lg">+7 (999) 123-45-67</p>
                </div>
                <div className="bg-zinc-800/50 rounded-2xl p-6">
                    <p className="text-zinc-400 text-sm mb-1">Дата регистрации</p>
                    <p className="text-lg">15 апреля 2026</p>
                </div>
            </div>
        </div>
    );
}

function GarageSection({ vehicles, onAddClick }: {
    vehicles: any[];
    onAddClick: () => void
}) {
    const { setDefaultVehicle, deleteVehicle } = useProfileStore();

    const [vehicleToEdit, setVehicleToEdit] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const openEditModal = (vehicle: any) => {
        setVehicleToEdit(vehicle);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setVehicleToEdit(null);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-semibold">Мой гараж ({vehicles.length})</h3>
                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-2xl text-sm font-medium transition"
                >
                    <Plus size={20} />
                    Добавить автомобиль
                </button>
            </div>

            {vehicles.length === 0 ? (
                <div className="text-center py-20 text-zinc-400">
                    <Car size={48} className="mx-auto mb-4 opacity-40" />
                    <p className="text-lg">В гараже пока нет автомобилей</p>
                    <p className="text-sm mt-2">Добавьте своё ТС для быстрого подбора запчастей</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            className="bg-zinc-800/50 rounded-3xl p-7 hover:bg-zinc-800 transition-all group border border-zinc-700/50"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <p className="text-2xl font-bold">
                                            {vehicle.brand} {vehicle.model}
                                        </p>
                                        {vehicle.isDefault && (
                                            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-medium">
                                                Основной
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-zinc-400 mt-1">{vehicle.year} год</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-zinc-500 uppercase tracking-widest">VIN</p>
                                    <p className="font-mono text-sm">{vehicle.vin}</p>
                                </div>
                            </div>

                            {vehicle.bodyNumber && (
                                <div className="mt-4 text-sm">
                                    <span className="text-zinc-500">Номер кузова: </span>
                                    <span className="font-mono">{vehicle.bodyNumber}</span>
                                </div>
                            )}

                            {vehicle.engine && (
                                <div className="mt-3 text-sm">
                                    <span className="text-zinc-500">Двигатель: </span>
                                    <span>{vehicle.engine}</span>
                                </div>
                            )}

                            {vehicle.notes && (
                                <p className="text-xs text-zinc-400 mt-4 italic">«{vehicle.notes}»</p>
                            )}

                            {/* Панель действий */}
                            <div className="mt-6 pt-6 border-t border-zinc-700 flex flex-wrap gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                {!vehicle.isDefault && (
                                    <button
                                        onClick={() => {
                                            setDefaultVehicle(vehicle.id);
                                            toast.success(`${vehicle.brand} ${vehicle.model} — теперь основной`);
                                        }}
                                        className="text-emerald-400 hover:text-emerald-500 text-sm font-medium flex items-center gap-1.5"
                                    >
                                        ⭐ Сделать основным
                                    </button>
                                )}

                                <button
                                    onClick={() => openEditModal(vehicle)}
                                    className="text-blue-400 hover:text-blue-500 text-sm font-medium flex items-center gap-1.5"
                                >
                                    <Edit2 size={16} />
                                    Редактировать
                                </button>

                                <button
                                    onClick={() => {
                                        if (confirm(`Удалить ${vehicle.brand} ${vehicle.model}?`)) {
                                            deleteVehicle(vehicle.id);
                                            toast.success("Автомобиль удалён из гаража");
                                        }
                                    }}
                                    className="text-red-400 hover:text-red-500 text-sm font-medium"
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Модалка редактирования */}
            <AddVehicleModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                vehicleToEdit={vehicleToEdit}
            />
        </>
    );
}

function OrdersList({ orders }: { orders: any[] }) {
    if (orders.length === 0) {
        return <div className="text-center py-20 text-zinc-400">У вас пока нет заказов</div>;
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => (
                <div key={order.id} className="bg-zinc-800/50 rounded-2xl p-6 hover:bg-zinc-800 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="font-mono text-sm text-zinc-500">{order.id}</p>
                            <p className="text-lg font-medium mt-1">{order.date}</p>
                        </div>
                        <span className={`px-4 py-1.5 text-sm rounded-full font-medium ${
                            order.status === "delivered" ? "bg-emerald-500/10 text-emerald-400" :
                                order.status === "shipped" ? "bg-blue-500/10 text-blue-400" : "bg-amber-500/10 text-amber-400"
                        }`}>
                            {order.status === "delivered" && "Доставлен"}
                            {order.status === "shipped" && "В пути"}
                            {order.status === "pending" && "В обработке"}
                        </span>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-sm text-zinc-400">{order.itemsCount} позиций</p>
                            <p className="text-2xl font-semibold mt-1">{order.total.toLocaleString()} ₽</p>
                        </div>
                        <button className="text-blue-500 hover:text-blue-400 text-sm font-medium">Подробнее →</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function WishlistSection({ wishlist }: { wishlist: string[] }) {
    return (
        <div>
            <h3 className="text-2xl font-semibold mb-6">Избранное {wishlist.length > 0 && `(${wishlist.length})`}</h3>
            {wishlist.length === 0 ? (
                <div className="text-center py-20 text-zinc-400">
                    <Heart size={48} className="mx-auto mb-4 opacity-40" />
                    <p className="text-lg">В избранном пока ничего нет</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-zinc-800 rounded-2xl p-8 text-center text-zinc-400 border border-dashed border-zinc-700">
                        Здесь будут карточки избранных товаров
                    </div>
                </div>
            )}
        </div>
    );
}

function AddressesSection({ addresses }: { addresses: any[] }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold">Адреса доставки ({addresses.length})</h3>
                <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-2xl text-sm font-medium transition">
                    + Новый адрес
                </button>
            </div>

            <div className="space-y-4">
                {addresses.map((addr) => (
                    <div key={addr.id} className="bg-zinc-800/50 rounded-2xl p-6 flex gap-6 group">
                        <MapPin className="w-6 h-6 text-zinc-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <p className="font-medium">{addr.name}</p>
                                {addr.isDefault && (
                                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-0.5 rounded-full">Основной</span>
                                )}
                            </div>
                            <p className="text-zinc-300 mt-2">{addr.street}</p>
                            <p className="text-zinc-400">{addr.city}, {addr.postalCode}</p>
                            <p className="text-zinc-400 mt-1">{addr.phone}</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-all flex flex-col gap-2 text-sm">
                            <button className="text-blue-400 hover:text-blue-500">Изменить</button>
                            {!addr.isDefault && <button className="text-red-400 hover:text-red-500">Удалить</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}