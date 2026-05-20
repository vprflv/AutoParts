// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/src/lib/prisma";
import { toPlain } from "@/lib/utils/toPlain";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        const filters = {
            search: searchParams.get('search') || undefined,
            brand: searchParams.get('brand') || undefined,
            onlyInStock: searchParams.get('onlyInStock') === 'true',
            sort: searchParams.get('sort') || 'default',
            page: parseInt(searchParams.get('page') || '1'),
            limit: parseInt(searchParams.get('limit') || '8'),
        };

        const page = filters.page;
        const limit = filters.limit;
        const skip = (page - 1) * limit;

        const where: any = {};

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

        return NextResponse.json({
            products: toPlain(products),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });

    } catch (error) {
        console.error('API /products error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}