"use server";

import { prisma } from "@/src/lib/prisma";
import { getCurrentUserId } from "@/lib/auth/auth";

export async function getUserVehicles() {
    const userId = await getCurrentUserId();
    console.log("[getUserVehicles] userId:", userId);

    if (!userId) return [];

    return prisma.vehicle.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}

export async function addVehicle(data: any) {
    console.log("[addVehicle] Запрос пришёл с данными:", data);

    const userId = await getCurrentUserId();
    console.log("[addVehicle] Получен userId:", userId);

    if (!userId) {
        throw new Error("Пользователь не авторизован (userId = null)");
    }

    const vehicle = await prisma.vehicle.create({
        data: {
            userId,
            brand: data.brand,
            model: data.model,
            year: Number(data.year),
            engine: data.engine || null,
            vin: data.vin || null,
            bodyNumber: data.bodyNumber || null,
            notes: data.notes || null,
        },
    });

    console.log("[addVehicle] ✅ Автомобиль успешно создан, ID:", vehicle.id);
    return vehicle;
}

export async function updateVehicle(id: string, data: any) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Пользователь не авторизован");

    return prisma.vehicle.update({
        where: { id, userId },
        data,
    });
}

export async function deleteVehicle(id: string) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Пользователь не авторизован");

    await prisma.vehicle.delete({
        where: { id, userId },
    });

    return true;
}