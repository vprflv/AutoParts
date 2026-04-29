'use client';

import { Suspense } from 'react';
import HomeContent from "@/src/features/home/HomeContent";


export default function HomePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="text-white text-xl">Загрузка магазина...</div>
            </div>
        }>
            <HomeContent />
        </Suspense>
    );
}