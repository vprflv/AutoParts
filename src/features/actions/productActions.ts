"use server";

import { prisma } from "@/src/lib/prisma";
import { ProductsFilter } from "@/src/types";

// ====================== Вспомогательная функция ======================
function generateSearchText(data: any): string {
    const parts = [
        data.name,
        data.oem,
        data.brand,
        ...(Array.isArray(data.crossNumbers) ? data.crossNumbers : [])
    ].filter(Boolean);

    return parts.join(" | ");
}


// ====================== Создание товара ======================
export async function createProduct(data: any) {
    const searchText = generateSearchText(data);

    return prisma.product.create({
        data: {
            ...data,
            searchText,
        }
    });
}


// ====================== Обновление товара ======================
export async function updateProduct(id: string, data: any) {
    const searchText = generateSearchText(data);

    return prisma.product.update({
        where: { id },
        data: {
            ...data,
            searchText,
        }
    });
}





// ====================== getProducts (быстрый поиск) ======================
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
                id: true, name: true, oem: true, price: true, brand: true,
                stock: true, images: true, description: true, crossNumbers: true,
            }
        }),
        prisma.product.count({ where }),
    ]);

    return {
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
}

export async function getBrands() {
    const brands = await prisma.product.findMany({
        where: {
            brand: { not: undefined }
        },
        select: {
            brand: true
        },
        distinct: ['brand'],
        orderBy: {
            brand: 'asc'
        }
    });

    return brands.map(item => item.brand).filter(Boolean); // на всякий случай
}


export async function getProduct(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        throw new Error("Товар не найден");
    }

    return product;
}

export async function cleanupBrokenImages() {
    const products = await prisma.product.findMany({
        select: { id: true, oem: true, images: true }
    });

    let cleaned = 0;

    for (const product of products) {
        const cleanImages = product.images.filter((url): url is string =>
            typeof url === "string" &&
            url.trim() !== "" &&
            !url.includes("undefined") &&
            !url.includes("null") &&
            url.startsWith("http")
        );

        if (cleanImages.length !== product.images.length) {
            await prisma.product.update({
                where: { id: product.id },
                data: { images: cleanImages }
            });
            cleaned++;
            console.log(`🧹 Очищен товар ${product.oem}: ${product.images.length} → ${cleanImages.length}`);
        }
    }

    console.log(`✅ Очистка завершена. Обработано товаров: ${cleaned}`);
    return cleaned;
}


