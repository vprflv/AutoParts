"use server";

import { prisma } from "@/src/lib/prisma";

export async function createOrder(data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryAddress: string;
    comment?: string;
    cartItems?: any[];           // ← Добавляем явно
}) {
    let cartItems = data.cartItems;

    // Если cartItems не передали — пытаемся достать из store
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

    const totalAmount = cartItems.reduce((sum: number, item: any) =>
        sum + item.price * item.quantity, 0
    );

    // Получаем пользователя
    let userId: string | null = null;
    try {
        const { createServerClientFn } = await import("@/src/lib/supabase/server");
        const supabase = await createServerClientFn();
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id || null;
    } catch (_) {}

    const order = await prisma.order.create({
        data: {
            userId: userId || undefined,
            totalAmount,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerEmail: data.customerEmail,
            deliveryAddress: data.deliveryAddress,
            comment: data.comment || null,

            items: {
                create: cartItems.map((item: any) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
            },
        },
        include: { items: true },
    });

    // Очищаем корзину
    try {
        const { useCartStore } = await import("@/src/store/useCartStore");
        useCartStore.getState().clearCart();
    } catch (_) {}

    return { success: true, orderId: order.id, order };
}


export async function getUserOrders(userId: string) {
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
                        }
                    }
                }
            }
        }
    });

    return orders.map(order => ({
        id: order.id,
        created_at: order.createdAt.toISOString(),
        total: Number(order.totalAmount),
        status: order.status,
        delivery_address: order.deliveryAddress,
        comment: order.comment,
        items_count: order.items.length,
        items: order.items.map(item => ({
            id: item.productId,
            name: item.product?.name || "Товар",
            oem: item.product?.oem || "",
            price: Number(item.price),
            quantity: item.quantity,
            image: item.product?.images?.[0] || "",
        }))
    }));
}