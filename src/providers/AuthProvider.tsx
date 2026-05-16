// src/providers/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/src/store/useAuthStore";
import { createClient } from "@/src/lib/supabase/client";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { loadUser } = useAuthStore();

    useEffect(() => {
        // Первоначальная загрузка пользователя
        loadUser();

        // Подписка на изменения авторизации
        const supabase = createClient();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event) => {
                console.log("🔄 Auth state changed:", event);

                if (event === "SIGNED_IN" ||
                    event === "TOKEN_REFRESHED" ||
                    event === "USER_UPDATED") {
                    await loadUser();
                }
                else if (event === "SIGNED_OUT") {
                    useAuthStore.setState({ user: null });
                }
            }
        );

        // Cleanup
        return () => {
            subscription.unsubscribe();
        };
    }, [loadUser]);

    return <>{children}</>;
}