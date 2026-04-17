import { create } from "zustand";

type CartItem = {
    id: string;
    name: string;
    oem:string;
    price: number;
    quantity: number;
    image: string;
};

interface CartStore {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
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
    updateQuantity: (id, quantity) =>
        set((state) => ({
            items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
    clearCart: () => set({ items: [] }),
    totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    totalPrice: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
}));