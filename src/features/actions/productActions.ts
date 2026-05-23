"use server";

import { prisma } from "@/src/lib/prisma";
import { ProductsFilter } from "@/src/types";
import {toPlain} from "@/lib/utils/toPlain";


// export async function getProducts(filters: ProductsFilter & { page?: number; limit?: number }) {
//     const page = filters.page || 1;
//     const limit = filters.limit || 8;
//     const skip = (page - 1) * limit;
//
//     const where: any = {};
//
//     if (filters.search?.trim()) {
//         const term = filters.search.trim();
//         where.OR = [
//             { name: { contains: term, mode: "insensitive" } },
//             { oem: { contains: term, mode: "insensitive" } },
//             { brand: { contains: term, mode: "insensitive" } },
//         ];
//     }
//
//     if (filters.brand) where.brand = filters.brand;
//     if (filters.onlyInStock) where.stock = { gt: 0 };
//
//     const orderBy = filters.sort === "price_asc" ? { price: "asc" as const }
//         : filters.sort === "price_desc" ? { price: "desc" as const }
//             : { createdAt: "desc" as const };
//
//     const [products, total] = await Promise.all([
//         prisma.product.findMany({
//             where,
//             orderBy,
//             skip,
//             take: limit,
//             select: {
//                 id: true,
//                 name: true,
//                 oem: true,
//                 price: true,
//                 brand: true,
//                 stock: true,
//                 images: true,
//             }
//         }),
//         prisma.product.count({ where }),
//     ]);
//
//     return {
//         products: toPlain(products),
//         total,
//         page,
//         totalPages: Math.ceil(total / limit),
//     };
// }

// export async function getBrands() {
//     const brands = await prisma.product.findMany({
//         where: { brand: { not: undefined } },
//         select: { brand: true },
//         distinct: ['brand'],
//         orderBy: { brand: 'asc' }
//     });
//
//     return brands.map(item => item.brand).filter(Boolean);
// }

export async function getBrands() {
    const brands = await prisma.product.findMany({
        where: { brand: { not: undefined } },
        select: { brand: true },
        distinct: ['brand'],
        orderBy: { brand: 'asc' },
    });

    return brands.map(item => item.brand).filter(Boolean);
}

export async function getProduct(id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id , active: true},
        });

        if (!product) {
            throw new Error("Товар не найден");
        }

        return toPlain(product);
    } catch (error) {
        console.error("getProduct error:", error);
        throw error;
    }
}

// export async function getFeaturedProducts() {
//     const products = await prisma.product.findMany({
//         take: 8,
//         orderBy: { createdAt: 'desc' },
//         select: {
//             id: true,
//             name: true,
//             oem: true,
//             price: true,
//             brand: true,
//             stock: true,
//             images: true,
//         }
//     });
//
//     return { products: toPlain(products) };
// }

export async function getProductsServer(
    filters: Partial<ProductsFilter> & {
        page?: number;
        limit?: number
    } = {}
) {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    const where: any = {active: true,};

    if (filters.search?.trim()) {
        const term = filters.search.trim();
        where.OR = [
            { name: { contains: term, mode: "insensitive" } },
            { oem: { contains: term, mode: "insensitive" } },
            { brand: { contains: term, mode: "insensitive" } },
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
            }
        }),
        prisma.product.count({ where }),
    ]);

    return {
        products: toPlain(products),
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
}

// export async function searchProducts(term: string, limit = 24) {
//     if (!term?.trim()) {
//         return getProductsServer({ page: 1, limit: 12 });
//     }
//
//     const searchTerm = term.toLowerCase().trim();
//
//     const [products, total] = await Promise.all([
//         prisma.product.findMany({
//             where: {
//                 searchText: {
//                     contains: searchTerm,   // простой поиск
//                     mode: "insensitive"
//                 }
//             },
//             orderBy: { createdAt: 'desc' },
//             take: limit,
//             select: {
//                 id: true,
//                 name: true,
//                 oem: true,
//                 price: true,
//                 brand: true,
//                 stock: true,
//                 images: true,
//             }
//         }),
//         prisma.product.count({
//             where: {
//                 searchText: {
//                     contains: searchTerm,
//                     mode: "insensitive"
//                 }
//             }
//         })
//     ]);
//
//     return {
//         products: toPlain(products),
//         total,
//         page: 1,
//         totalPages: Math.ceil(total / limit),
//     };
// }


export async function getAllLightProducts() {
    const products = await prisma.product.findMany({
        where: { active: true },
        select: {
            id: true,
            name: true,
            oem: true,
            price: true,
            brand: true,
            stock: true,
            images: true,
            crossNumbers: true,

            description: true,
            specifications: true,
            applicability: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    return toPlain(products);
}



