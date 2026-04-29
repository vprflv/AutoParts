// src/store/useProfileStore.ts
import { create } from "zustand";
import { createClient } from "@/src/lib/supabase/client";
import {toast} from "react-hot-toast";

export interface OrderItem {
    name: string;
    oem?: string;           // ← под твою корзину
    brand?: string;
    qty: number;            // оставляем qty для базы
    price: number;
}

export interface Order {
    id: string;
    user_id?: string;           // null для гостевых заказов
    guest_name?: string;
    guest_email?: string;
    guest_phone?: string;

    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
    total: number;
    items_count: number;
    delivery_address: string;
    comment?: string;
    created_at: string;
}

interface ProfileStore {
    createOrder: (orderData: {
        total: number;
        items: OrderItem[];
        delivery_address: string;
        comment?: string;
        guest_name?: string;
        guest_email?: string;
        guest_phone?: string;
    }) => Promise<boolean>;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
    createOrder: async (orderData) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        try {
            const { error } = await supabase
                .from("orders")
                .insert({
                    user_id: user?.id || null,
                    guest_name: orderData.guest_name,
                    guest_email: orderData.guest_email,
                    guest_phone: orderData.guest_phone,
                    total: orderData.total,
                    items_count: orderData.items.length,
                    delivery_address: orderData.delivery_address,
                    comment: orderData.comment || null,
                });

            if (error) throw error;

            toast.success("Заказ успешно оформлен! Спасибо за покупку.");
            return true;
        } catch (err: any) {
            console.error("Ошибка создания заказа:", err);
            toast.error("Не удалось оформить заказ");
            return false;
        }
    },
}));