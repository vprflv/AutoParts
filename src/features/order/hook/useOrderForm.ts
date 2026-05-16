// src/features/order/hooks/useOrderForm.ts
import { useState, useMemo } from "react";
import { useCartStore } from "@/src/store/useCartStore";
import toast from "react-hot-toast";

export function useOrderForm() {
    const { items, clearCart } = useCartStore();

    const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("delivery");
    const [showOrderItems, setShowOrderItems] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        comment: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Фильтрация товаров в наличии
    const availableItems = useMemo(() =>
            items.filter(item => (item.stock ?? 0) > 0),
        [items]);


    const totalAvailablePrice = useMemo(() =>
            availableItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        [availableItems]);

    const unavailableCount = items.length - availableItems.length;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent, onSuccess?: () => void) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (availableItems.length === 0) {
            toast.error("Нет товаров в наличии для оформления заказа");
            setIsSubmitting(false);
            return false;
        }

        // Имитация отправки заказа
        await new Promise(resolve => setTimeout(resolve, 1400));

        toast.success(`Заказ успешно оформлен! (${availableItems.length} товаров)`);

        clearCart();
        onSuccess?.();
        setIsSubmitting(false);
        return true;
    };

    return {
        formData,
        availableItems,
        unavailableCount,
        deliveryType,
        setDeliveryType,
        showOrderItems,
        setShowOrderItems,
        isSubmitting,
        totalPrice: totalAvailablePrice,
        handleChange,
        handleSubmit,
    };
}