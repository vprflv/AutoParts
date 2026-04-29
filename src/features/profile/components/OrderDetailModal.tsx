// src/features/profile/components/OrderDetailModal.tsx
"use client";
import { X, Truck, CheckCircle, Clock, XCircle } from "lucide-react";

interface OrderDetailModalProps {
    order: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
    if (!isOpen || !order) return null;

    const getStatus = (status: string) => {
        switch (status) {
            case "delivered": return { text: "Доставлен", color: "text-emerald-400", icon: CheckCircle };
            case "shipped": return { text: "В пути", color: "text-blue-400", icon: Truck };
            case "confirmed": return { text: "Подтверждён", color: "text-amber-400", icon: Clock };
            case "pending": return { text: "В обработке", color: "text-amber-400", icon: Clock };
            case "cancelled": return { text: "Отменён", color: "text-red-400", icon: XCircle };
            default: return { text: status, color: "text-zinc-400", icon: Clock };
        }
    };

    const status = getStatus(order.status);
    const StatusIcon = status.icon;

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 p-4">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
                    <div>
                        <h2 className="text-xl font-semibold">Заказ #{order.id.slice(0, 8)}</h2>
                        <p className="text-sm text-zinc-400">
                            {new Date(order.created_at).toLocaleDateString("ru-RU", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white">
                        <X size={28} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Статус */}
                    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-zinc-800/70 ${status.color}`}>
                        <StatusIcon size={24} />
                        <span className="font-medium">{status.text}</span>
                    </div>

                    {/* Сумма */}
                    <div className="bg-zinc-800 rounded-2xl p-5">
                        <div className="flex justify-between items-baseline">
                            <span className="text-zinc-400">Итого</span>
                            <span className="text-3xl font-bold">{order.total.toLocaleString("ru-RU")} ₽</span>
                        </div>
                    </div>

                    {/* Адрес */}
                    <div>
                        <p className="text-zinc-400 text-sm mb-2">Адрес доставки</p>
                        <p className="text-zinc-200 leading-relaxed">{order.delivery_address}</p>
                    </div>

                    {/* Комментарий */}
                    {order.comment && (
                        <div>
                            <p className="text-zinc-400 text-sm mb-2">Комментарий к заказу</p>
                            <p className="text-zinc-200 leading-relaxed">{order.comment}</p>
                        </div>
                    )}

                    {/* Состав заказа */}
                    <div>
                        <p className="text-zinc-400 text-sm mb-3">Состав заказа ({order.items_count} позиций)</p>
                        <div className="space-y-4">
                            {order.items?.map((item: any, index: number) => (
                                <div key={index} className="flex justify-between bg-zinc-800/50 rounded-2xl p-4">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        {item.oem && <p className="text-xs text-zinc-500">OEM: {item.oem}</p>}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            {item.price.toLocaleString("ru-RU")} ₽
                                        </p>
                                        <p className="text-sm text-zinc-400">× {item.qty}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-zinc-800">
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-medium transition-colors"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
}