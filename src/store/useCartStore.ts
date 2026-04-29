// src/store/useCartStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type CartItem = {
    id: string;
    name: string;
    oem: string;
    price: number;
    quantity: number;
    image: string;
    stock: number;
};

interface CartStore {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
    getItemQuantity: (id: string) => number;
    isInCart: (id: string) => boolean;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product) =>
                set((state) => {
                    const existing = state.items.find((i) => i.id === product.id);
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                            ),
                        };
                    }
                    return { items: [...state.items, { ...product, quantity: 1 }] };
                }),

            removeItem: (id) =>
                set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

            updateQuantity: (id, newQuantity) => {
                const currentItem = get().items.find((i) => i.id === id);
                if (!currentItem) return;

                if (newQuantity < 1) {
                    set((state) => ({
                        items: state.items.filter((i) => i.id !== id),
                    }));
                    return;
                }

                if (newQuantity > (currentItem.stock || 999)) return;

                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, quantity: newQuantity } : i
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),

            getItemQuantity: (id) => {
                const item = get().items.find((i) => i.id === id);
                return item ? item.quantity : 0;
            },

            isInCart: (id) => get().items.some((i) => i.id === id),

            totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

            totalPrice: () =>
                get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
        }),

        {
            name: "cart-storage",                    // ключ в localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);