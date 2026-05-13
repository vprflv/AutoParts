// src/features/actions/vehicleActions.ts
"use server";

import { prisma } from "@/src/lib/prisma";
import {getCurrentProfileUserId, getCurrentUserId} from "@/src/lib/auth";

export async function getUserVehicles() {
    const userId = await getCurrentProfileUserId();
    if (!userId) return [];

    return prisma.vehicle.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}

export async function addVehicle(data: {
    brand: string;
    model: string;
    year: number;
    engine?: string;
    vin?: string;
    bodyNumber?: string;
    notes?: string;
}) {
    const userId = await getCurrentProfileUserId();
    if (!userId) throw new Error("Пользователь не авторизован");

    return prisma.vehicle.create({
        data: {
            userId,
            ...data,
        },
    });
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