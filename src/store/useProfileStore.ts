// src/store/useProfileStore.ts
import { create } from "zustand";
import { createClient } from "@/src/lib/supabase/client";
import { toast } from "react-hot-toast";
import {useCartStore} from "@/src/store/useCartStore";

export interface OrderItem {
    name: string;
    oem?: string;
    brand?: string;
    qty: number;
    price: number;
}

export interface Order {
    id: string;
    user_id?: string | null;
    guest_name?: string;
    guest_email?: string;
    guest_phone?: string;

    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
    total: number;
    items_count: number;
    delivery_address: string;
    comment?: string;
    created_at: string;
    items?: OrderItem[];        // для отображения в истории
}

interface ProfileStore {
    orders: Order[];
    isLoading: boolean;

    loadOrders: () => Promise<void>;
    createOrder: (orderData: {
        total: number;
        items: OrderItem[];
        delivery_address: string;
        comment?: string;
        guest_name?: string;
        guest_email?: string;
        guest_phone?: string;
    }) => Promise<boolean>;

    repeatOrder: (orderId: string) => Promise<boolean>;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
    orders: [],
    isLoading: false,

    loadOrders: async () => {
        set({ isLoading: true });
        const supabase = createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("orders")
                .select(`
                *,
                order_items (*)
            `)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;

            // Нормализация
            const normalized = (data || []).map(order => ({
                ...order,
                items: order.order_items || [],
            }));

            set({ orders: normalized });
        } catch (err) {
            console.error(err);
        } finally {
            set({ isLoading: false });
        }
    },

    createOrder: async (orderData) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        try {
            const { data: newOrder, error: orderError } = await supabase
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
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // Добавляем товары с изображением
            const orderItems = orderData.items.map((item: any) => ({
                order_id: newOrder.id,
                name: item.name,
                oem: item.oem || null,
                qty: item.qty,
                price: item.price,
                image: item.image || null,
            }));

            const { error: itemsError } = await supabase
                .from("order_items")
                .insert(orderItems);

            if (itemsError) throw itemsError;

            await get().loadOrders();

            toast.success("Заказ успешно оформлен!");
            return true;
        } catch (err: any) {
            console.error("Ошибка создания заказа:", err);
            toast.error("Не удалось оформить заказ");
            return false;
        }
    },

    repeatOrder: async (orderId: string) => {
        const order = get().orders.find(o => o.id === orderId);

        if (!order) {
            toast.error("Заказ не найден");
            return false;
        }

        const items = order.items || order.order_items || [];

        if (items.length === 0) {
            toast.error("В заказе нет товаров для повторения");
            console.warn("Пустой заказ:", order);
            return false;
        }

        try {
            const { addItem } = useCartStore.getState();

            console.log(`🔄 Повторяем заказ ${orderId}, товаров: ${items.length}`);

            items.forEach((item: any) => {
                addItem({
                    id: `repeat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    name: item.name,
                    oem: item.oem || "",
                    price: item.price,
                    quantity: item.qty || item.quantity || 1,
                    image: item.image || "/images/placeholder.svg",           // берём фото, если оно есть
                    stock: 999,
                });
            });

            toast.success(`Товары из заказа #${orderId.slice(0,8)} добавлены в корзину!`);
            return true;
        } catch (err) {
            console.error("Ошибка повторения заказа:", err);
            toast.error("Не удалось добавить товары в корзину");
            return false;
        }
    },
}));