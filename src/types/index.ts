import { SVGProps } from "react";
type SortOption = "default" | "price_asc" | "price_desc";


export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
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
  applicability?: string[];
  crossNumbers?: string[];
};

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  engine: string;
  vin?: string;
  createdAt: string;
}

