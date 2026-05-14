// src/app/api/products/oems/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            select: { oem: true },
        });

        const oems = products
            .map(p => p.oem)
            .filter((oem): oem is string =>
                oem != null && typeof oem === 'string' && oem.trim() !== ''
            )
            .map(oem => oem.toUpperCase());

        return NextResponse.json({
            oems,
            count: oems.length
        });
    } catch (error) {
        console.error('Ошибка получения OEM:', error);
        return NextResponse.json({ oems: [] }, { status: 500 });
    }
}