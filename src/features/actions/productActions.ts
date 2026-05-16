"use server";

import { prisma } from "@/src/lib/prisma";
import { ProductsFilter } from "@/src/types";
import {toPlain} from "@/lib/utils/toPlain";


export async function getProducts(filters: ProductsFilter & { page?: number; limit?: number }) {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.search?.trim()) {
        const term = filters.search.trim();
        where.OR = [
            { name:        { contains: term, mode: "insensitive" } },
            { oem:         { contains: term, mode: "insensitive" } },
            { brand:       { contains: term, mode: "insensitive" } },
            { description: { contains: term, mode: "insensitive" } },
            { searchText:  { contains: term, mode: "insensitive" } },
        ];
    }

    if (filters.brand) where.brand = filters.brand;
    if (filters.onlyInStock) where.stock = { gt: 0 };

    const orderBy = filters.sort === "price_asc" ? { price: "asc" as const }
        : filters.sort === "price_desc" ? { price: "desc" as const }
            : { createdAt: "desc" as const };

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                oem: true,
                price: true,
                brand: true,
                stock: true,
                images: true,
                description: true,
                crossNumbers: true,
            }
        }),
        prisma.product.count({ where }),
    ]);

    return {
        products: toPlain(products),        // ← КРИТИЧНО
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
}

export async function getBrands() {
    const brands = await prisma.product.findMany({
        where: { brand: { not: undefined } },
        select: { brand: true },
        distinct: ['brand'],
        orderBy: { brand: 'asc' }
    });

    return brands.map(item => item.brand).filter(Boolean);
}

export async function getProduct(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        throw new Error("Товар не найден");
    }

    return toPlain(product);     // ← тоже нужно!
}

