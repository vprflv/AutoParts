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
  images: string[];
  stock: number;
  applicability: string[];
};

