import { Suspense } from 'react';
import {ProfileContent} from "@/src/features/profile/ProfileContent";
  // ← вынеси основной код сюда

export default function ProfilePage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg">Загрузка профиля...</div>
            </div>
        }>
            <ProfileContent />
        </Suspense>
    );
}