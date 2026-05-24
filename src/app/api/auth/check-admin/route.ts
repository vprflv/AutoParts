// app/api/auth/check-admin/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ success: false, message: "No userId" }, { status: 400 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, role: true }
        });

        if (!dbUser) {
            return NextResponse.json({
                success: false,
                message: "User not found in database"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
        });

    } catch (error) {
        console.error("check-admin error:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}