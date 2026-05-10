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
  category: string;
  brand: string;
  stock: number;
  images: string[];

  description?: string | null;
  specifications?: ProductSpecifications | null;
  applicability?: string[];
  crossNumbers?: string[];

  created_at?: string;
  updated_at?: string;
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
  engine?: string;
  vin?: string;
  createdAt: string;
}

