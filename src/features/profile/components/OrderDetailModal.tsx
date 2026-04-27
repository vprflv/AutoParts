"use client";

import { X, Truck, CheckCircle, Clock, MapPin, Calendar, RotateCw } from "lucide-react";
import { Order } from "@/src/store/useProfileStore";
import { useOrderDetail } from "@/src/features/profile/hooks/useOrderDetail";

interface OrderDetailModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
    const { isDelivered, handleRepeatOrder } = useOrderDetail(order);

    if (!isOpen || !order) return null;


    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-2xl border border-zinc-700 max-h-[95vh] overflow-hidden flex flex-col">
                {/* Заголовок */}
                <div className="flex items-center justify-between border-b border-zinc-700 px-5 py-4 sm:px-6 sm:py-5">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-semibold">Заказ {order.id}</h2>
                        <p className="text-xs sm:text-sm text-zinc-400 mt-1">{order.date}</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white">
                        <X size={22} className="sm:w-6 sm:h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-5 sm:p-6 space-y-6 sm:space-y-8">

                    {/* Товары */}
                    <div>
                        <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                            Товары в заказе ({order.itemsCount})
                        </h3>
                        <div className="space-y-3 sm:space-y-4">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between bg-zinc-800/50 rounded-2xl p-4">
                                    <div className="pr-3">
                                        <p className="text-sm sm:text-base font-medium leading-tight">{item.name}</p>
                                        <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                                            {item.brand} • {item.article}
                                        </p>
                                    </div>
                                    <div className="text-right text-sm sm:text-base">
                                        <p>{item.qty} шт.</p>
                                        <p className="text-zinc-400">{item.price.toLocaleString()} ₽</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Итого */}
                    <div className="bg-zinc-800/70 rounded-2xl p-4 sm:p-5 flex justify-between items-center text-lg sm:text-xl font-semibold">
                        <span>Итого</span>
                        <span>{order.total.toLocaleString()} ₽</span>
                    </div>

                    {/* Доставка */}
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <MapPin className="text-zinc-400 mt-1 flex-shrink-0" size={20} />
                            <div>
                                <p className="text-xs sm:text-sm text-zinc-400">Адрес доставки</p>
                                <p className="text-sm sm:text-base text-zinc-200 leading-snug">{order.deliveryAddress}</p>
                            </div>
                        </div>

                        {order.trackingNumber && (
                            <div className="flex gap-4">
                                <Truck className="text-zinc-400 mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <p className="text-xs sm:text-sm text-zinc-400">Трекинг-номер</p>
                                    <p className="font-mono text-sm sm:text-base text-zinc-200">{order.trackingNumber}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Нижние кнопки */}
                <div className="border-t border-zinc-700 p-4 sm:p-6 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 sm:py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-medium text-sm sm:text-base transition"
                    >
                        Закрыть
                    </button>

                    {isDelivered && (
                        <button
                            onClick={handleRepeatOrder}
                            className="flex-1 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-medium flex items-center justify-center gap-2 text-sm sm:text-base transition"
                        >
                            <RotateCw size={18} className="sm:w-5 sm:h-5" />
                            Повторить заказ
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}