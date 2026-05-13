import { createServerClientFn } from "@/src/lib/supabase/server"; // ← путь к твоему файлу

export async function getCurrentUserId(): Promise<string | null> {
    const supabase = await createServerClientFn();
    const { data: { user } } = await supabase.auth.getUser();

    return user?.id || null;
}

export async function getCurrentUser() {
    const supabase = await createServerClientFn();
    const { data: { user } } = await supabase.auth.getUser();

    return user;
}