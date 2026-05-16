import { createClient } from "./client";
import { useAuthStore } from "@/src/store/useAuthStore";

export async function supabaseWithUser() {
    const supabase = createClient();
    const currentUser = useAuthStore.getState().user;

    if (!currentUser) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            // Обновляем стор
            await useAuthStore.getState().loadUser();
        }
    }

    return supabase;
}