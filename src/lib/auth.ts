// src/lib/auth.ts
import { createServerClientFn } from "@/src/lib/supabase/server";

export async function getCurrentUserId(): Promise<string | null> {
    const supabase = await createServerClientFn();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
}

export async function getCurrentProfileUserId(): Promise<string | null> {
    const supabase = await createServerClientFn();

    const { data: { user }, error } = await supabase.auth.getUser();

    console.log("[getCurrentProfileUserId] User ID:", user?.id);
    console.log("[getCurrentProfileUserId] Error:", error?.message);

    if (!user?.id) {
        console.log("[getCurrentProfileUserId] ❌ Нет сессии");
        return null;
    }

    return user.id;
}