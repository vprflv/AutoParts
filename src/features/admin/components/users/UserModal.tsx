"use client";

import { User, Vehicle } from "@prisma/client";
import { X } from "lucide-react";

type UserWithVehicles = User & { vehicles: Vehicle[] };

interface UserModalProps {
    user: UserWithVehicles;
    onClose: () => void;
}

export default function UserModal({ user, onClose }: UserModalProps) {
    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-lg sm:max-w-2xl max-h-[92vh] flex flex-col">
                <div className="flex items-center justify-between p-5 sm:p-6 border-b border-zinc-700">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold">Информация о пользователе</h2>
                        <p className="text-zinc-500 text-sm sm:text-base">{user.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-800 rounded-xl transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-8 text-sm">
                    {/* Основные данные */}
                    <div>
                        <h3 className="text-base font-semibold mb-4 text-zinc-400">Основные данные</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-zinc-500 text-xs">Имя</p>
                                <p className="font-medium">{user.name || "—"}</p>
                            </div>
                            <div>
                                <p className="text-zinc-500 text-xs">Username</p>
                                <p>@{user.username || "—"}</p>
                            </div>
                            <div>
                                <p className="text-zinc-500 text-xs">Email</p>
                                <p className="break-all">{user.email || "—"}</p>
                            </div>
                            <div>
                                <p className="text-zinc-500 text-xs">Телефон</p>
                                <p className="text-emerald-400">{user.phone || "—"}</p>
                            </div>
                            <div>
                                <p className="text-zinc-500 text-xs">Роль</p>
                                <p className="capitalize">{user.role.toLowerCase()}</p>
                            </div>
                            <div>
                                <p className="text-zinc-500 text-xs">Дата регистрации</p>
                                <p>{new Date(user.createdAt).toLocaleString("ru-RU")}</p>
                            </div>
                        </div>
                    </div>

                    {/* Автомобили */}
                    <div>
                        <h3 className="text-base font-semibold mb-4 text-zinc-400">
                            Автомобили ({user.vehicles.length})
                        </h3>
                        {user.vehicles.length > 0 ? (
                            <div className="space-y-4">
                                {user.vehicles.map((vehicle, i) => (
                                    <div key={i} className="bg-zinc-950 border border-zinc-700 rounded-2xl p-5">
                                        <div className="font-semibold">
                                            {vehicle.brand} {vehicle.model} {vehicle.year}
                                        </div>
                                        {vehicle.vin && (
                                            <div className="mt-2 font-mono text-amber-400 break-all">
                                                VIN: <span className="font-medium">{vehicle.vin}</span>
                                            </div>
                                        )}
                                        {vehicle.engine && <div className="text-sm mt-1">Двигатель: {vehicle.engine}</div>}
                                        {vehicle.bodyNumber && <div className="text-sm">Кузов: {vehicle.bodyNumber}</div>}
                                        {vehicle.notes && (
                                            <div className="mt-3 text-sm text-zinc-400 italic">
                                                {vehicle.notes}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-zinc-500 py-4">Автомобили не добавлены</p>
                        )}
                    </div>
                </div>

                <div className="p-5 sm:p-6 border-t border-zinc-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition-colors text-sm sm:text-base"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
}