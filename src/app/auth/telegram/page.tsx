'use client';

import { Suspense } from 'react';
import {TelegramAuthContent} from "@/features/auth/telegram/TelegramAuthContent";


export default function TelegramAuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Вход через Telegram</h1>
                    <p className="text-zinc-400">Загрузка...</p>
                </div>
            </div>
        }>
            <TelegramAuthContent />
        </Suspense>
    );
}