import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "@/src/common/components/Footer";
import AuthProvider from "@/src/providers/AuthProvider";
import {startMagicTokenCleanup} from "@/lib/cron/clean-magic-tokens";


export const metadata: Metadata = {
    title: "AutoPart Pro — Автозапчасти",
    description: "Современный магазин автозапчастей",
    icons: {
        icon: ['/icon-512.png','/icon-192.png', '/icon-32.png', '/icon-16.png'],
        apple: '/apple-touch-icon.png',
        shortcut: '/icon-16.png',
    },
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