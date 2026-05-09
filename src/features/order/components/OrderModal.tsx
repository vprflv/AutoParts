"use client";

import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { useOrderForm } from "@/src/features/order/hook/useOrderForm";
import { useProfileStore } from "@/src/store/useProfileStore";
import { useCartStore } from "@/src/store/useCartStore";

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    redirectAfterSuccess?: boolean;
    onSuccess: () => void;
}

export default function OrderModal({
                                       isOpen,
                                       onClose,
                                       redirectAfterSuccess = false,
                                       onSuccess,
                                   }: OrderModalProps) {
    const router = useRouter();

    const { createOrder } = useProfileStore();
    const { clearCart } = useCartStore();

    const [agreePolicy, setAgreePolicy] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        formData,
        availableItems,
        deliveryType,
        setDeliveryType,
        showOrderItems,
        setShowOrderItems,
        totalPrice,
        handleChange,
    } = useOrderForm();

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreePolicy) {
            toast.error("Необходимо согласиться с условиями");
            return;
        }

        if (availableItems.length === 0) {
            toast.error("Корзина пуста");
            return;
        }

        setIsSubmitting(true);

        const success = await createOrder({
            total: totalPrice,
            items: availableItems.map((item) => ({
                name: item.name,
                oem: item.oem,
                qty: item.quantity,
                price: item.price,
                image: item.image || "",
            })),
            delivery_address: formData.address || "Самовывоз",
            comment: formData.comment,
            guest_name: formData.name,
            guest_email: formData.email,
            guest_phone: formData.phone,
        });

        setIsSubmitting(false);

        if (success) {
            clearCart();
            toast.success("Заказ успешно оформлен! Спасибо за покупку!");

            onClose();
            onSuccess?.();

            if (redirectAfterSuccess) {
                setTimeout(() => {
                    router.push("/profile?tab=orders");
                }, 700);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 p-4 sm:p-6">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-lg mx-auto max-h-[94vh] overflow-hidden flex flex-col border border-zinc-700 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-950 flex-shrink-0">
                    <h2 className="text-2xl text-cyan-300 font-semibold tracking-tight">Оформление заказа</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white p-3 -mr-2 transition-all hover:scale-110"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Табы доставки */}
                <div className="flex border-b border-zinc-800 text-sm sm:text-base font-medium">
                    <button
                        onClick={() => setDeliveryType("delivery")}
                        className={`flex-1 py-4 text-center transition-all ${
                            deliveryType === "delivery"
                                ? "border-b-2 border-cyan-400 text-white"
                                : "text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        🚚 Доставка
                    </button>
                    <button
                        onClick={() => setDeliveryType("pickup")}
                        className={`flex-1 py-4 text-center transition-all ${
                            deliveryType === "pickup"
                                ? "border-b-2 border-cyan-400 text-white"
                                : "text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        🏪 Самовывоз
                    </button>
                </div>

                {/* Контент */}
                <div className="flex-1 overflow-y-auto custom-scroll-purple p-6 space-y-6">
                    <form onSubmit={handleFormSubmit} className="space-y-6">

                        <div>
                            <label className="block text-sm text-zinc-400 mb-1.5">Имя и фамилия *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-cyan-400"
                                placeholder="Иван Иванов"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1.5">Телефон *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-cyan-400"
                                    placeholder="+7 (999) 123-45-67"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-cyan-400"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {deliveryType === "delivery" && (
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1.5">Адрес доставки *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-cyan-400"
                                    placeholder="г. Москва, ул. Ленина, д. 10, кв. 55"
                                />
                            </div>
                        )}

                        {/* Состав заказа */}
                        <div>
                            <button
                                type="button"
                                onClick={() => setShowOrderItems(!showOrderItems)}
                                className="w-full flex items-center justify-between bg-zinc-800 hover:bg-zinc-700 px-5 py-4 rounded-2xl transition-colors"
                            >
                                <span>Состав заказа ({availableItems.length} товара)</span>
                                {showOrderItems ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>

                            {showOrderItems && (
                                <div className="mt-3 bg-zinc-800 rounded-2xl p-4 space-y-3 max-h-60 overflow-y-auto text-sm custom-scroll-purple">
                                    {availableItems.map((item) => (
                                        <div key={item.id} className="flex justify-between">
                                            <span className="text-zinc-300">{item.name}</span>
                                            <span className="font-medium">
                                                {item.price.toLocaleString("ru-RU")} ₽ × {item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Комментарий */}
                        <div>
                            <label className="block text-sm text-zinc-400 mb-1.5">Комментарий</label>
                            <textarea
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-5 py-4 text-base focus:outline-none focus:border-cyan-400 resize-y"
                                placeholder="Особые пожелания..."
                            />
                        </div>

                        {/* Итого */}
                        <div className="bg-zinc-800 rounded-3xl p-6">
                            <div className="flex justify-between items-center text-xl font-semibold">
                                <span>Итого к оплате:</span>
                                <span className="text-white">{totalPrice.toLocaleString("ru-RU")} ₽</span>
                            </div>
                        </div>

                        {/* Согласие */}
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="order-policy"
                                checked={agreePolicy}
                                onChange={(e) => setAgreePolicy(e.target.checked)}
                                className="mt-1.5 w-5 h-5 accent-cyan-500 bg-zinc-800 border-zinc-700 rounded focus:ring-cyan-400"
                            />
                            <label htmlFor="order-policy" className="text-sm text-zinc-400 leading-relaxed cursor-pointer">
                                Я согласен с{" "}
                                <span className="text-cyan-400 hover:underline">условиями покупки</span> и даю согласие на обработку персональных данных
                            </label>
                        </div>

                        {/* Кнопка подтверждения */}
                        <button
                            type="submit"
                            disabled={!agreePolicy || isSubmitting || availableItems.length === 0}
                            className="btn-neon disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? "Оформляем заказ..." : "Подтвердить заказ"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}