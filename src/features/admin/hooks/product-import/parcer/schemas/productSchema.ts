import { z } from "zod";

export const ProductSchema = z.object({
    name: z.string()
        .min(1, "Название обязательно")
        .transform(v => String(v).trim()),

    oem: z.string()
        .min(3, "OEM обязателен (минимум 3 символа)")
        .transform(v => String(v).trim().toUpperCase()),

    brand: z.string()
        .min(1, "Бренд обязателен")
        .transform(v => String(v).trim()),

    price: z.union([z.number(), z.string()])
        .transform(v => Number(v) || 0)
        .refine(v => v >= 0, "Цена не может быть отрицательной"),

    stock: z.union([z.number(), z.string()])
        .transform(v => Number(v) || 0)
        .default(0),

    category: z.string().default("Разное"),
    description: z.string().optional().default(""),
    applicability: z.array(z.string()).default([]),
    crossNumbers: z.string().default(""),
    specifications: z.record(z.string(), z.any()).default({}),
    images: z.array(z.string()).default([]),
}).passthrough();