"use client";

import { useEffect } from "react";
import { useProfileStore } from "@/src/store/useProfileStore";
import { toast } from "react-hot-toast";
import { RefreshCw, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrdersList() {
    const { orders, isLoading, loadOrders, repeatOrder } = useProfileStore();
    const router = useRouter();

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    if (isLoading) {
        return (
            <div className="py-20 text-center text-zinc-400">
                <div className="flex justify-center mb-6">
                    <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
                </div>
                Загрузка заказов...
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-20 text-zinc-400 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-700">
                <Package size={64} className="mx-auto mb-6 opacity-40" />
                <p className="text-2xl font-medium">У вас пока нет заказов</p>
                <p className="text-zinc-500 mt-3 max-w-xs mx-auto">
                    Когда оформите первый заказ, он появится здесь
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => (
                <div
                    key={order.id}
                    className="bg-zinc-900 border border-zinc-700 hover:border-cyan-500/30 rounded-3xl p-6 sm:p-7 transition-all group"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-mono text-xs sm:text-sm text-zinc-500">
                                Заказ #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <p className="text-3xl sm:text-4xl font-bold text-white mt-2 tracking-tighter">
                                {order.total.toLocaleString("ru-RU")} ₽
                            </p>
                        </div>

                        <div className="text-right text-sm text-zinc-400">
                            <p>{new Date(order.created_at).toLocaleDateString("ru-RU")}</p>
                            <p className="mt-1">
                                {order.items_count} товар{order.items_count > 1 ? "ов" : ""}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 text-sm text-zinc-400">
                        <p className="text-xs mb-1 text-zinc-500">Адрес доставки:</p>
                        <p className="text-zinc-300 leading-relaxed">
                            {order.delivery_address}
                        </p>
                    </div>

                    {order.comment && (
                        <div className="mt-5 text-sm text-zinc-400">
                            <p className="text-xs mb-1 text-zinc-500">Комментарий:</p>
                            <p className="text-zinc-300 leading-relaxed">
                                {order.comment}
                            </p>
                        </div>
                    )}

                    {/* Кнопка "Повторить заказ" */}
                    <button
                        onClick={async () => {
                            const success = await repeatOrder(order.id);
                            if (success) {
                                router.push("/cart");
                            } else {
                                toast.error("Не удалось повторить заказ");
                            }
                        }}
                        className="w-full mt-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500
                                   rounded-2xl font-semibold text-lg transition-all active:scale-[0.985] shadow-neon-main flex items-center justify-center gap-3"
                    >
                        <RefreshCw size={20} className="group-hover:rotate-45 transition-transform" />
                        Повторить заказ
                    </button>
                </div>
            ))}
        </div>
    );
}