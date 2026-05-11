"use server";

import { prisma } from "@/src/lib/prisma";
import { Product } from "@/src/types";

export async function getAdminProducts(): Promise<Product[]> {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return products;
    } catch (error) {
        console.error("Ошибка получения товаров для админки:", error);
        return [];
    }
}

export async function deleteProductAction(id: string) {
    try {
        await prisma.product.delete({
            where: { id }
        });
        return { success: true };
    } catch (error) {
        console.error("Ошибка удаления товара:", error);
        throw error;
    }
}