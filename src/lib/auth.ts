// src/lib/auth.ts
import { createServerClientFn } from "@/src/lib/supabase/server";

export async function getCurrentUserId(): Promise<string | null> {
    const supabase = await createServerClientFn();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
}

export async function getCurrentProfileUserId(): Promise<string | null> {
    const supabase = await createServerClientFn();

    // Получаем пользователя из сессии
    const { data: { user }, error } = await supabase.auth.getUser();

    console.log("[getCurrentProfileUserId] Auth user:", user?.id, "Error:", error?.message);

    if (!user?.id) {
        console.log("[getCurrentProfileUserId] Пользователь не авторизован");
        return null;
    }

    // Для Telegram пользователей иногда нужно дополнительно проверить профиль
    const { data: profile } = await supabase
        .from('profiles')
        .select('userid')
        .eq('userid', user.id)
        .single();

    console.log("[getCurrentProfileUserId] Profile found:", !!profile);

    return user.id; // возвращаем user.id из auth.users
}