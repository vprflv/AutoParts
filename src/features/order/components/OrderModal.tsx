"use client";

import { X, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { createOrder } from "@/features/actions/orderActions";
import { useCartStore } from "@/src/store/useCartStore";
import { useAuthStore } from "@/src/store/useAuthStore";

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
    const { user } = useAuthStore();
    const { items, clearCart } = useCartStore();

    const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
    const [showOrderItems, setShowOrderItems] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agreePolicy, setAgreePolicy] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        phone: "",
        email: user?.email || "",
        address: "",
        comment: "",
    });

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreePolicy) {
            toast.error("Необходимо согласиться с условиями");
            return;
        }

        if (!formData.name || !formData.phone || (deliveryType === "delivery" && !formData.address)) {
            toast.error("Заполните обязательные поля");
            return;
        }

        if (items.length === 0) {
            toast.error("Корзина пуста");
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await createOrder({
                customerName: formData.name,
                customerPhone: formData.phone,
                customerEmail: formData.email,
                deliveryAddress: deliveryType === "delivery" ? formData.address : "Самовывоз",
                comment: formData.comment,
                cartItems: items,                    // ← Важно! Передаём товары явно
            });

            if (result.success) {
                clearCart();
                toast.success("Заказ успешно оформлен! Спасибо за покупку!");

                onSuccess?.();
                onClose();

                if (redirectAfterSuccess) {
                    setTimeout(() => router.push("/profile?tab=orders"), 800);
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Не удалось оформить заказ");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 p-4 sm:p-6">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-lg mx-auto max-h-[94vh] overflow-hidden flex flex-col border border-zinc-700 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-950 flex-shrink-0">
                    <h2 className="text-2xl text-cyan-300 font-semibold tracking-tight">Оформление заказа</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white p-3 -mr-2">
                        <X size={28} />
                    </button>
                </div>

                {/* Табы доставки */}
                <div className="flex border-b border-zinc-800 text-sm sm:text-base font-medium">
                    <button
                        onClick={() => setDeliveryType("delivery")}
                        className={`flex-1 py-4 text-center transition-all ${
                            deliveryType === "delivery" ? "border-b-2 border-cyan-400 text-white" : "text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        🚚 Доставка
                    </button>
                    <button
                        onClick={() => setDeliveryType("pickup")}
                        className={`flex-1 py-4 text-center transition-all ${
                            deliveryType === "pickup" ? "border-b-2 border-cyan-400 text-white" : "text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        🏪 Самовывоз
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scroll-purple p-6 space-y-6">
                    {/* Имя */}
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1.5">Имя и фамилия *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-cyan-400 outline-none"
                            placeholder="Иван Иванов"
                        />
                    </div>

                    {/* Телефон + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-zinc-400 mb-1.5">Телефон *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-cyan-400 outline-none"
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
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-cyan-400 outline-none"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    {/* Адрес доставки */}
                    {deliveryType === "delivery" && (
                        <div>
                            <label className="block text-sm text-zinc-400 mb-1.5">Адрес доставки *</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-cyan-400 outline-none"
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
                            <span>Состав заказа ({items.length} товара)</span>
                            {showOrderItems ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        {showOrderItems && (
                            <div className="mt-3 bg-zinc-800 rounded-2xl p-4 space-y-3 max-h-60 overflow-y-auto text-sm">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-zinc-300">
                                        <span>{item.name}</span>
                                        <span>{item.price.toLocaleString("ru-RU")} ₽ × {item.quantity}</span>
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
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-5 py-4 focus:border-cyan-400 outline-none resize-y"
                            placeholder="Особые пожелания..."
                        />
                    </div>

                    {/* Итого */}
                    <div className="bg-zinc-800 rounded-3xl p-6">
                        <div className="flex justify-between items-center text-xl font-semibold">
                            <span>Итого к оплате:</span>
                            <span>{totalPrice.toLocaleString("ru-RU")} ₽</span>
                        </div>
                    </div>

                    {/* Политика */}
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            id="policy"
                            checked={agreePolicy}
                            onChange={(e) => setAgreePolicy(e.target.checked)}
                            className="mt-1.5 accent-cyan-500"
                        />
                        <label htmlFor="policy" className="text-sm text-zinc-400 cursor-pointer">
                            Я согласен с условиями покупки и обработкой персональных данных
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !agreePolicy || items.length === 0}
                        className="btn-neon w-full py-4 text-lg disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={24} />
                                Оформляем...
                            </>
                        ) : (
                            "Подтвердить заказ"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}