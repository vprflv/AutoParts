// src/features/profile/hooks/useOrderDetail.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/src/store/useCartStore";
import { products } from "@/src/lib/mockData";
import toast from "react-hot-toast";

export function useOrderDetail(order: any) {
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);

    const [isCartModalOpen, setIsCartModalOpen] = useState(false);

    const isDelivered = order?.status === "delivered";

    const handleRepeatOrder = () => {
        if (!order) return;

        let addedCount = 0;
        let outOfStockCount = 0;

        order.items.forEach((orderItem: any) => {
            const product = products.find(
                (p) => p.id === orderItem.id || p.oem === orderItem.article
            );

            const availableStock = product?.stock ?? 0;

            addItem({
                id: orderItem.id,
                name: orderItem.name,
                oem: orderItem.article || "",
                price: orderItem.price,
                image: product?.images?.[0] || "",
                stock: availableStock,
            });

            if (availableStock > 0) addedCount++;
            else outOfStockCount++;
        });

        if (addedCount > 0) {
            toast.success(`Добавлено ${addedCount} товаров в корзину`);
        }
        if (outOfStockCount > 0) {
            toast.error(`${outOfStockCount} товаров нет в наличии`);
        }

        // Переход на страницу корзины
        setTimeout(() => {
            router.push("/cart");
        }, 300);
    };

    return {
        isDelivered,
        handleRepeatOrder,
        isCartModalOpen,
        setIsCartModalOpen,
    };
}