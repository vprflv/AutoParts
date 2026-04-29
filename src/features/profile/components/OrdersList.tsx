// src/features/profile/components/OrdersList.tsx
"use client";

import { useEffect } from "react";
import { useProfileStore } from "@/src/store/useProfileStore";
import { toast } from "react-hot-toast";
import {RefreshCw} from "lucide-react";
import {useRouter} from "next/navigation";

export default function OrdersList() {
    const { orders, isLoading, loadOrders, repeatOrder } = useProfileStore();
    const router = useRouter();
    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    if (isLoading) {
        return <div className="py-20 text-center text-zinc-400">Загрузка заказов...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-20 text-zinc-400">
                <p className="text-xl">У вас пока нет заказов</p>
                <p className="text-sm mt-2">Когда оформите первый заказ, он появится здесь</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => (
                <div
                    key={order.id}
                    className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-mono text-sm text-zinc-500">
                                Заказ #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <p className="text-3xl font-semibold mt-2">
                                {order.total.toLocaleString("ru-RU")} ₽
                            </p>
                        </div>

                        <div className="text-right text-sm text-zinc-400">
                            <p>{new Date(order.created_at).toLocaleDateString("ru-RU")}</p>
                            <p className="mt-1">{order.items_count} товар{order.items_count > 1 ? "ов" : ""}</p>
                        </div>
                    </div>

                    <div className="mt-6 text-sm text-zinc-400">
                        <p>Адрес доставки:</p>
                        <p className="text-zinc-300 mt-1">{order.delivery_address}</p>
                    </div>

                    {order.comment && (
                        <div className="mt-4 text-sm text-zinc-400">
                            <p>Комментарий:</p>
                            <p className="text-zinc-300 mt-1">{order.comment}</p>
                        </div>
                    )}

                    <button
                        onClick={async () => {
                            const success = await repeatOrder(order.id);
                            if (success) {
                                router.push("/cart");
                            }
                        }}
                        className="flex-1 py-3.5 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={18}/>
                        Повторить заказ
                    </button>
                </div>
            ))}
        </div>
    );
}