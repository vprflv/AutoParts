"use server";

import { prisma } from "@/src/lib/prisma";
import { getCurrentUserId } from "@/src/lib/auth";

export async function createOrder(data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryAddress: string;
    comment?: string;
    cartItems?: any[];
}) {
    let cartItems = data.cartItems;

    // Если cartItems не передали — берём из store
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

    // ←←← ИСПРАВЛЕНИЕ: делаем заказ возможным и для гостей
    const orderData: any = {
        totalAmount: cartItems.reduce((sum: number, item: any) => {
            return sum + Number(item.price) * item.quantity;
        }, 0),

        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || null,
        deliveryAddress: data.deliveryAddress,
        comment: data.comment || null,

        items: {
            create: cartItems.map((item: any) => ({
                productId: item.id,
                quantity: item.quantity,
                price: Number(item.price),
            })),
        },
    };

    // Если пользователь авторизован — привязываем заказ к нему
    if (userId) {
        orderData.userId = userId;
    }

    const order = await prisma.order.create({
        data: orderData,
        include: {
            items: {
                include: {
                    product: {
                        select: { name: true, oem: true, images: true },
                    },
                },
            },
        },
    });

    // Очищаем корзину
    try {
        const { useCartStore } = await import("@/src/store/useCartStore");
        useCartStore.getState().clearCart();
    } catch (_) {}

    const plainOrder = {
        ...order,
        totalAmount: Number(order.totalAmount),
        items: order.items.map((item: any) => ({
            ...item,
            price: Number(item.price),
        })),
    };

    return {
        success: true,
        orderId: order.id,
        order: plainOrder,
        isGuest: !userId, // полезно знать на фронте
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
                            name: true,
                            oem: true,
                            images: true,
                        },
                    },
                },
            },
        },
    });

    return orders.map((order) => ({
        id: order.id,
        created_at: order.createdAt.toISOString(),
        total: Number(order.totalAmount),
        status: order.status,
        delivery_address: order.deliveryAddress,
        comment: order.comment,
        items_count: order.items.length,
        items: order.items.map((item) => ({
            id: item.productId,
            name: item.product?.name || "Товар",
            oem: item.product?.oem || "",
            price: Number(item.price),
            quantity: item.quantity,
            image: item.product?.images?.[0] || "",
        })),
    }));
}