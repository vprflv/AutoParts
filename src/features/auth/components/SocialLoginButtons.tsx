"use client";

import { Search, Users, Send, ShoppingBag } from "lucide-react";

interface SocialLoginButtonsProps {
    onSocialClick: (provider: string) => void;
    onTelegramClick?: () => void;
}

const providers = [
    { name: "Yandex", color: "#FF0000", icon: Search },
    { name: "VK", color: "#4C75A3", icon: Users },
    { name: "Telegram", color: "#229ED9", icon: Send },
    { name: "Avito", color: "#FF8A00", icon: ShoppingBag },
];

export default function SocialLoginButtons({ onSocialClick, onTelegramClick }: SocialLoginButtonsProps) {
    return (
        <div className="space-y-4">
            <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-zinc-700 w-full"></div>
                <span className="absolute bg-zinc-900 px-4 text-sm text-zinc-500">или через</span>
            </div>

            <div className="flex gap-3 justify-center overflow-x-auto pb-2 scrollbar-hide">
                {providers.map(({ name, color, icon: Icon }) => (
                    <button
                        key={name}
                        onClick={() => {
                            if (name === "Telegram" && onTelegramClick) {
                                onTelegramClick();
                            } else {
                                onSocialClick(name.toLowerCase());
                            }
                        }}
                        className="flex-shrink-0 flex flex-col items-center justify-center gap-2 w-20 py-3 rounded-2xl font-medium transition-all hover:scale-105 active:scale-95"
                    >
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                            style={{ backgroundColor: color }}
                        >
                            <Icon size={26} className="text-white" />
                        </div>
                        <span className="text-xs text-white text-center">{name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}