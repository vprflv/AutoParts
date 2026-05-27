"use server";

import { prisma } from "@/src/lib/prisma";
import { getCurrentUserId } from "@/lib/auth/auth";
import {toPlain} from "@/lib/utils/toPlain";
import {CartItem} from "@/types";
import { Prisma } from "@prisma/client";


export async function createOrder(data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryAddress: string;
    comment?: string;
    cartItems?: any[];
}) {
    let cartItems = data.cartItems;

    if (!cartItems || cartItems.length === 0) {
        try {
            const { useCartStore } = await import("@/src/store/useCartStore");
            cartItems = useCartStore.getState().items;
        } catch (e) {
            console.error("Не удалось получить корзину из store");
        }
    }

    if (!cartItems || cartItems.length === 0) {
        throw new Error("Корзина пуста. Добавьте товары перед оформлением.");
    }

    const userId = await getCurrentUserId();

    const order = await prisma.order.create({
        data: {
            userId: userId || undefined,

            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerEmail: data.customerEmail || null,
            deliveryAddress: data.deliveryAddress,
            comment: data.comment || null,

            totalAmount: cartItems.reduce((sum: number, item: any) => {
                return sum + Number(item.price) * item.quantity;
            }, 0),

            status: "PENDING",

            items: {
                create: cartItems.map((item: CartItem): Prisma.OrderItemUncheckedCreateWithoutOrderInput => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
            },
        },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            oem: true,
                            price: true,
                            brand: true,
                            images: true,
                        },
                    },
                },
            },
        },
    });


    try {
        const { useCartStore } = await import("@/src/store/useCartStore");
        useCartStore.getState().clearCart();
    } catch (_) {}


    const plainOrder = toPlain(order);

    return {
        success: true,
        orderId: order.id,
        order: plainOrder,
        isGuest: !userId,
    };
}

export async function getUserOrders() {
    const userId = await getCurrentUserId();
    if (!userId) return [];

    const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            oem: true,
                            price: true,
                            stock: true,
                            active: true,
                            brand: true,
                            images: true,
                        },
                    },
                },
            },
        },
    });


    return toPlain(orders.map((order) => ({
        id: order.id,
        created_at: order.createdAt,
        total: order.totalAmount,
        status: order.status,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        deliveryAddress: order.deliveryAddress,
        comment: order.comment,
        items_count: order.items.length,
        items: order.items.map((item) => ({
            id: item.productId,
            name: item.product?.name || "Товар",
            oem: item.product?.oem || "",
            price: item.price,
            quantity: item.quantity,
            image: item.product?.images?.[0] || "",

            stock: item.product?.stock ?? 0,
            active: item.product?.active ?? false,
        })),
    })));
}