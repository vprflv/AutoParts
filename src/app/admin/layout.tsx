// app/admin/layout.tsx
import { redirect } from "next/navigation";
import AdminSidebar from "@/features/admin/components/AdminSidebar";
import AdminMobileHeaderWrapper from "@/features/admin/components/AdminMobileSidebarWrapper";
import { createServerClientFn } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import {getCurrentAdmin} from "@/features/admin/lib/getCurrentAdmin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // const supabase = await createServerClientFn();
    // const { data: { user }, error } = await supabase.auth.getUser();
    //
    // console.log("=== ADMIN LAYOUT START ===");
    // console.log("Supabase User ID:", user?.id);
    // console.log("Supabase User Email:", user?.email);
    //
    // if (error || !user) {
    //     console.log("❌ No Supabase session");
    //     redirect("/auth/login");
    // }
    //
    // const dbUser = await prisma.user.findUnique({
    //     where: { id: user.id },
    //     select: { id: true, email: true, role: true }
    // });
    //
    // console.log("Prisma dbUser:", dbUser);
    //
    // if (!dbUser) {
    //     console.log("❌ User not found in Prisma table");
    //     await supabase.auth.signOut();
    //     redirect("/?access=denied");
    // }
    //
    // if (dbUser.role !== "ADMIN") {
    //     console.log(`❌ ACCESS DENIED! Role = ${dbUser.role} for user ${dbUser.email}`);
    //     await supabase.auth.signOut();
    //     redirect("/?access=denied");
    // }

    getCurrentAdmin()


    // console.log(`✅ ADMIN ACCESS GRANTED for ${dbUser.email} (${dbUser.role})`);
    // console.log("=== ADMIN LAYOUT END ===");

    return (
        <div className="flex min-h-screen bg-zinc-950">
            <div className="hidden lg:block w-72 border-r border-zinc-800 flex-shrink-0">
                <AdminSidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0 w-full">
                <AdminMobileHeaderWrapper />
                <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}