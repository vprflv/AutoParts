// src/store/useProfileStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OrderItem {
    id: string;
    name: string;
    article: string;
    brand: string;
    qty: number;
    price: number;
    stock:number;
}

export interface Order {
    id: string;
    date: string;
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
    total: number;
    itemsCount: number;
    items: OrderItem[];
    deliveryAddress: string;
    trackingNumber?: string;
    comment?: string;
}

interface ProfileStore {
    orders: Order[];
    loadMockOrders: () => void;
}

export const useProfileStore = create<ProfileStore>()(
    persist(
        (set, get) => ({
            orders: [],

            loadMockOrders: () => {
                if (get().orders.length === 0) {
                    set({
                        orders: [
                            {
                                id: "ORD-20260425-001",
                                date: "2026-04-25",
                                status: "delivered",
                                total: 12450,
                                itemsCount: 3,
                                items: [
                                    { id: "3", name: "Свечи зажигания NGK Iridium", article: "NGK-12345IR", brand: "NGK", qty: 1, price: 2450 },
                                    { id: "p2", name: "Свечи зажигания NGK", article: "BKR6E-11", brand: "NGK", qty: 4, price: 890 },
                                    { id: "p3", name: "Тормозные колодки Bosch", article: "0 986 494 512", brand: "Bosch", qty: 1, price: 4250 },
                                ],
                                deliveryAddress: "Москва, ул. Ленина 45, кв. 12",
                                trackingNumber: "TRK-987654321",
                            },
                            {
                                id: "ORD-20260422-002",
                                date: "2026-04-22",
                                status: "shipped",
                                total: 6730,
                                itemsCount: 1,
                                items: [
                                    { id: "p4", name: "Аккумулятор Varta Silver Dynamic", article: "574 400 068", brand: "Varta", qty: 1, price: 6730 },
                                ],
                                deliveryAddress: "Москва, ул. Ленина 45, кв. 12",
                                trackingNumber: "TRK-1122334455",
                            },
                            {
                                id: "ORD-20260418-003",
                                date: "2026-04-18",
                                status: "pending",
                                total: 2890,
                                itemsCount: 2,
                                items: [],
                                deliveryAddress: "Москва, ул. Ленина 45, кв. 12",
                            },
                        ],
                    });
                }
            },
        }),

        { name: "profile-storage" }
    )
);