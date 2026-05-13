import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "@/src/common/components/Footer";
import AuthProvider from "@/src/providers/AuthProvider";
import {startMagicTokenCleanup} from "@/lib/cron/clean-magic-tokens";


export const metadata: Metadata = {
    title: "AutoPart Pro — Автозапчасти",
    description: "Современный магазин автозапчастей",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {

    if (typeof window === "undefined") {
        startMagicTokenCleanup();
    }


    return (
        <html lang="ru" className="dark">
        <body className="bg-background text-foreground antialiased min-h-screen">
        <Providers>

            {children}

            <Footer />
        </Providers>
        </body>
        </html>
    );
}