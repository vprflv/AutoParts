// src/features/order/components/OrderModal.tsx
"use client";

import { X, ChevronDown, ChevronUp } from "lucide-react";

import { useRouter } from "next/navigation";
import {useOrderForm} from "@/src/features/order/hook/useOrderForm";

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    redirectAfterSuccess?: boolean;
    onSuccess?: () => void;
}

export default function OrderModal({
                                       isOpen,
                                       onClose,
                                       redirectAfterSuccess = false,
                                       onSuccess
                                   }: OrderModalProps) {

    const router = useRouter();

    const {
        formData,
        availableItems,
        unavailableCount,
        deliveryType,
        setDeliveryType,
        showOrderItems,
        setShowOrderItems,
        isSubmitting,
        totalPrice,
        handleChange,
        handleSubmit,
    } = useOrderForm();

    if (!isOpen) return null;

    const handleFormSuccess  = () => {

        onClose();
        onSuccess?.();
        if (redirectAfterSuccess) {
            router.push("/profile");
        }
    };

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 p-3 sm:p-6">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-lg mx-auto max-h-[94vh] sm:max-h-[92vh] md:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-zinc-800 flex-shrink-0">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Оформление заказа</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white p-1.5 sm:p-2">
                        <X size={24} className="sm:w-7 sm:h-7" />
                    </button>
                </div>

                {/* Табы */}
                <div className="flex border-b border-zinc-800 text-sm sm:text-base">
                    <button
                        onClick={() => setDeliveryType("delivery")}
                        className={`flex-1 py-3.5 sm:py-4 text-center font-medium transition-all ${
                            deliveryType === "delivery" ? "border-b-2 border-blue-600 text-white" : "text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        🚚 Доставка
                    </button>
                    <button
                        onClick={() => setDeliveryType("pickup")}
                        className={`flex-1 py-3.5 sm:py-4 text-center font-medium transition-all ${
                            deliveryType === "pickup" ? "border-b-2 border-blue-600 text-white" : "text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        🏪 Самовывоз
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <form onSubmit={(e) => handleSubmit(e, handleFormSuccess)} className="space-y-4 sm:space-y-6">
                        <div>
                            <label className="block text-xs sm:text-sm text-zinc-400 mb-1.5">Имя и фамилия *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-base focus:outline-none focus:border-blue-600"
                                placeholder="Иван Иванов"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm text-zinc-400 mb-1.5">Телефон *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-base focus:outline-none focus:border-blue-600"
                                    placeholder="+7 (999) 123-45-67"
                                />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm text-zinc-400 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-base focus:outline-none focus:border-blue-600"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {deliveryType === "delivery" && (
                            <div>
                                <label className="block text-xs sm:text-sm text-zinc-400 mb-1.5">Адрес доставки *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-base focus:outline-none focus:border-blue-600"
                                    placeholder="г. Москва, ул. Ленина, д. 10, кв. 55"
                                />
                            </div>
                        )}

                        {/* Состав заказа */}
                        <div>
                            <button
                                type="button"
                                onClick={() => setShowOrderItems(!showOrderItems)}
                                className="w-full flex items-center justify-between bg-zinc-800 hover:bg-zinc-700 px-5 py-4 rounded-2xl transition-colors text-sm sm:text-base"
                            >
                                <span>Состав заказа ({availableItems.length} товара)</span>
                                {showOrderItems ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>

                            {showOrderItems && (
                                <div className="mt-3 bg-zinc-800 rounded-2xl p-4 space-y-3 max-h-52 overflow-y-auto text-sm">
                                    {availableItems.map((item) => (
                                        <div key={item.id} className="flex justify-between">
                                            <span className="text-zinc-300 pr-3">{item.name}</span>
                                            <span className="font-medium whitespace-nowrap">
                                                {item.price.toLocaleString("ru-RU")} ₽ × {item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm text-zinc-400 mb-1.5">Комментарий</label>
                            <textarea
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-4 sm:px-5 py-3.5 sm:py-4 text-base focus:outline-none focus:border-blue-600 resize-y"
                                placeholder={deliveryType === "pickup"
                                    ? "Укажите удобное время самовывоза..."
                                    : "Подъезд, этаж, домофон..."}
                            />
                        </div>

                        {/* Итог */}
                        <div className="bg-zinc-800 rounded-2xl p-4 sm:p-5">
                            <div className="flex justify-between text-base sm:text-lg font-semibold">
                                <span>Итого к оплате:</span>
                                <span>{totalPrice.toLocaleString("ru-RU")} ₽</span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">
                                {deliveryType === "pickup" ? "Оплата при самовывозе" : "Оплата при получении"}
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || availableItems.length === 0}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 py-4 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg transition-all active:scale-[0.985]"
                        >
                            {isSubmitting ? "Оформляем заказ..." : "Подтвердить заказ"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}