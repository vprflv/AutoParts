// src/features/actions/vehicleActions.ts
"use server";

import { prisma } from "@/src/lib/prisma";
import { getCurrentProfileUserId } from "@/src/lib/auth";

export async function getUserVehicles() {
    const userId = await getCurrentProfileUserId();
    console.log("getUserVehicles → userId:", userId);
    if (!userId) return [];

    return prisma.vehicle.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}

export async function addVehicle(data: any) {
    console.log("addVehicle вызван с данными:", data);

    try {
        const userId = await getCurrentProfileUserId();
        console.log("addVehicle → userId:", userId);

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

        console.log("✅ Автомобиль успешно создан:", vehicle.id);
        return vehicle;

    } catch (error: any) {
        console.error("❌ ОШИБКА в addVehicle:", error);
        console.error("Сообщение:", error.message);
        console.error("Stack:", error.stack);
        throw error; // важно бросать дальше, чтобы видеть в логах
    }
}

export async function updateVehicle(id: string, data: any) {
    const userId = await getCurrentProfileUserId();
    if (!userId) throw new Error("Пользователь не авторизован");

    return prisma.vehicle.update({
        where: { id, userId },
        data,
    });
}

export async function deleteVehicle(id: string) {
    const userId = await getCurrentProfileUserId();
    if (!userId) throw new Error("Пользователь не авторизован");

    await prisma.vehicle.delete({
        where: { id, userId },
    });

    return true;
}