// src/app/profile/components/OrdersList.tsx
"use client";

import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { useProfileStore } from "@/src/store/useProfileStore";
import OrderDetailModal from "@/src/features/profile/components/OrderDetailModal";


export default function OrdersList() {
    const { orders, loadMockOrders } = useProfileStore();
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    useEffect(() => {
        loadMockOrders();
    }, [loadMockOrders]);

    const getStatus = (status: string) => {
        switch (status) {
            case "delivered": return { text: "Доставлен", color: "emerald", icon: CheckCircle };
            case "shipped": return { text: "В пути", color: "blue", icon: Truck };
            case "confirmed": return { text: "Подтверждён", color: "amber", icon: Clock };
            case "pending": return { text: "В обработке", color: "amber", icon: Clock };
            case "cancelled": return { text: "Отменён", color: "red", icon: XCircle };
            default: return { text: status, color: "zinc", icon: Package };
        }
    };

    if (orders.length === 0) {
        return (
            <div className="text-center py-20 text-zinc-400">
                <Package size={48} className="mx-auto mb-4 opacity-40" />
                <p className="text-lg">У вас пока нет заказов</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {orders.map((order) => {
                    const status = getStatus(order.status);
                    const Icon = status.icon;

                    return (
                        <div
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className="bg-zinc-800/50 rounded-3xl p-6 hover:bg-zinc-800 transition-all cursor-pointer group border border-zinc-700/50"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-mono text-sm text-zinc-500">{order.id}</p>
                                    <p className="text-lg font-medium mt-1">{order.date}</p>
                                </div>

                                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-${status.color}-500/10 text-${status.color}-400`}>
                                    <Icon size={18} />
                                    {status.text}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between items-end">
                                <div>
                                    <p className="text-sm text-zinc-400">{order.itemsCount} позиций</p>
                                    <p className="text-3xl font-semibold mt-1">{order.total.toLocaleString()} ₽</p>
                                </div>

                                <div className="text-blue-500 group-hover:text-blue-400 transition-colors text-sm font-medium">
                                    Подробнее →
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <OrderDetailModal
                order={selectedOrder}
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />
        </>
    );
}