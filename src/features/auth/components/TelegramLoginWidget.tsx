"use client";

import { useEffect } from "react";

interface TelegramLoginWidgetProps {
    botUsername: string;
    onAuth: (user: any) => void;
}

export default function TelegramLoginWidget({ botUsername, onAuth }: TelegramLoginWidgetProps) {
    useEffect(() => {
        console.log("📌 Telegram Widget загружается для домена auto-parts-beige.vercel.app");

        (window as any).onTelegramAuth = (user: any) => {
            console.log("✅ Telegram Auth Success:", user);
            onAuth(user);
        };

        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;

        script.setAttribute("data-telegram-login", botUsername.replace("@", ""));
        script.setAttribute("data-size", "large");
        script.setAttribute("data-radius", "12");
        script.setAttribute("data-request-access", "write");
        script.setAttribute("data-userpic", "true");


        document.body.appendChild(script);

        return () => {
            const scripts = document.querySelectorAll('script[src*="telegram-widget"]');
            scripts.forEach(s => s.remove());
        };
    }, [botUsername, onAuth]);

    return (
        <div className="py-8 text-center">

            <p className="text-zinc-400 mb-6">Нажмите кнопку ниже для входа</p>
            <div id="telegram-widget-container" />
        </div>
    );
}