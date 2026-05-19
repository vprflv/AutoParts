// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/features/actions/productActions';
import { ProductsFilter } from '@/src/types';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        const filters: ProductsFilter & { page?: number; limit?: number } = {
            search: searchParams.get('search') || '',           // ← важно: '' вместо undefined
            brand: searchParams.get('brand') || undefined,
            onlyInStock: searchParams.get('onlyInStock') === 'true',
            sort: (searchParams.get('sort') as any) || undefined,
            page: parseInt(searchParams.get('page') || '1'),
            limit: parseInt(searchParams.get('limit') || '12'),
        };

        const data = await getProducts(filters);

        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}