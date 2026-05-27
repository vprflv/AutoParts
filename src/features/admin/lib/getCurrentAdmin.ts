// src/lib/auth/getCurrentAdmin.ts
"use server";

import { prisma } from "@/lib/prisma";
import { createServerClientFn } from "@/lib/supabase/server";

export async function getCurrentAdmin() {
    try {
        const supabase = await createServerClientFn();

        // Получаем только id и email, чтобы минимизировать объект
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user?.id) {
            throw new Error("Не авторизован");
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });

        if (!dbUser) {
            throw new Error("Пользователь не найден в базе");
        }

        if (dbUser.role !== "ADMIN") {
            throw new Error("Доступ запрещён");
        }

        // Возвращаем максимально простой объект
        return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
        };

    } catch (err: any) {
        console.error("getCurrentAdmin error:", err);
        throw new Error(err.message || "Ошибка проверки администратора");
    }
}