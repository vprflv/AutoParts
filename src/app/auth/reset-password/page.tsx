"use client";

import { Suspense } from "react";
import ResetPasswordPageContent from "@/features/auth/components/ResetPasswordPage";



export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="text-cyan-400">Загрузка...</div>
            </div>
        }>
            <ResetPasswordPageContent />
        </Suspense>
    );
}