// src/features/admin/hooks/product-import/types.ts
export interface ImportProduct {
    name: string;
    oem: string;
    brand: string;
    price: number;
    stock: number;
    category: string;
    images: string[];
    applicability: string[];
    crossNumbers: string;
    description?: string;
}

export interface ImportResult {
    toAdd: ImportProduct[];
    toUpdate: ImportProduct[];
    errors: string[];
    stats: {
        total: number;
        new: number;
        updates: number;
        errors: number;
    };
}