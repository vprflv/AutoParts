// src/store/useProfileStore.ts
import { create } from "zustand";
import { getUserOrders } from "@/features/actions/orderActions";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useCartStore } from "@/src/store/useCartStore";
import { toast } from "react-hot-toast";

interface ProfileStore {
    orders: any[];
    isLoading: boolean;

    loadOrders: () => Promise<void>;
    // createOrder: (orderData: any) => Promise<boolean>;
    repeatOrder: (orderId: string) => Promise<boolean>;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
    orders: [],
    isLoading: false,

    loadOrders: async () => {
        set({ isLoading: true });
        const { user } = useAuthStore.getState();

        if (!user?.id) {
            set({ orders: [], isLoading: false });
            return;
        }

        try {
            const orders = await getUserOrders();
            set({ orders });
        } catch (err) {
            console.error("Ошибка загрузки заказов:", err);
        } finally {
            set({ isLoading: false });
        }
    },

    // createOrder: async (orderData) => {
    //     // оставляем как было у тебя раньше (или твой текущий код)
    //     // toast.info("createOrder вызван через старый store");
    //     return false; // пока заглушка
    // },

    repeatOrder: async (orderId: string) => {
        const order = get().orders.find(o => o.id === orderId);
        if (!order?.items?.length) {
            toast.error("В заказе нет товаров");
            return false;
        }

        try {
            const { addItem } = useCartStore.getState();

            order.items.forEach((item: any) => {
                addItem({
                    id: item.id,
                    name: item.name,
                    oem: item.oem || "",
                    price: item.price,
                    image: item.image || "",
                    stock: 999,
                });
            });

            toast.success(`Добавлено ${order.items.length} товаров из заказа в корзину`);
            return true;
        } catch (err) {
            toast.error("Не удалось повторить заказ");
            return false;
        }
    },
}));