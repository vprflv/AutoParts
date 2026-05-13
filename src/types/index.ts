import { SVGProps } from "react";

type SortOption = "default" | "price_asc" | "price_desc";

export type ProductSpecifications = {
    [key: string]: string | number | boolean | string[] | null | undefined;
};

export type ProductsFilter = {
    search: string;
    brand?: string;
    onlyInStock?: boolean;
    sort?: SortOption;
}

export type Product = {
    id: string;
    name: string;
    oem: string;
    price: number;
    category?: string | null;
    brand: string;
    stock: number;
    images: string[];
    applicability?: string[];
    crossNumbers?: string[];
    description?: string | null;
    specifications?: any;
    createdAt?: Date;
    updatedAt?: Date;
};

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
}

export interface Vehicle {
    id: string;
    brand: string;
    model: string;
    year: number;


    engine?: string | null;
    vin?: string | null;
    notes?: string | null;
    bodyNumber?: string | null;

    createdAt: Date;
    updatedAt: Date;
}