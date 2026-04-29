"use client";

import { useEffect } from "react";
import { useProfileStore } from "@/src/store/useProfileStore";
import { toast } from "react-hot-toast";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

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
            <div className="text-center py-16 sm:py-20 text-zinc-400">
                <p className="text-lg sm:text-xl">У вас пока нет заказов</p>
                <p className="text-sm mt-2 max-w-xs mx-auto">
                    Когда оформите первый заказ, он появится здесь
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => (
                <div
                    key={order.id}
                    className="bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-zinc-800 hover:border-zinc-700 transition-all"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-mono text-xs sm:text-sm text-zinc-500">
                                Заказ #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <p className="text-2xl sm:text-3xl font-semibold mt-1 sm:mt-2">
                                {order.total.toLocaleString("ru-RU")} ₽
                            </p>
                        </div>

                        <div className="text-right text-xs sm:text-sm text-zinc-400">
                            <p>{new Date(order.created_at).toLocaleDateString("ru-RU")}</p>
                            <p className="mt-1">
                                {order.items_count} товар{order.items_count > 1 ? "ов" : ""}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 sm:mt-6 text-sm text-zinc-400">
                        <p className="text-xs sm:text-sm mb-1">Адрес доставки:</p>
                        <p className="text-zinc-300 leading-relaxed">
                            {order.delivery_address}
                        </p>
                    </div>

                    {order.comment && (
                        <div className="mt-4 text-sm text-zinc-400">
                            <p className="text-xs sm:text-sm mb-1">Комментарий:</p>
                            <p className="text-zinc-300 leading-relaxed">
                                {order.comment}
                            </p>
                        </div>
                    )}

                    {/* Широкая кнопка "Повторить заказ" */}
                    <button
                        onClick={async () => {
                            const success = await repeatOrder(order.id);
                            if (success) {
                                router.push("/cart");
                            } else {
                                toast.error("Не удалось повторить заказ");
                            }
                        }}
                        className="w-full mt-6 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.985] rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-center gap-2.5"
                    >
                        <RefreshCw size={18} className="sm:w-5 sm:h-5" />
                        Повторить заказ
                    </button>
                </div>
            ))}
        </div>
    );
}