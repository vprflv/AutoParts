"use client";

import { Search, Users, Send, ShoppingBag } from "lucide-react";

interface SocialLoginButtonsProps {
    onSocialClick: (provider: string) => void;
    title?: string;
}

const providers = [
    { name: "Yandex", color: "#FF0000", icon: Search },
    { name: "VK", color: "#4C75A3", icon: Users },
    { name: "Telegram", color: "#229ED9", icon: Send },
    { name: "Avito", color: "#FF8A00", icon: ShoppingBag },
];

export default function SocialLoginButtons({ onSocialClick}: SocialLoginButtonsProps) {
    return (
        <div className="space-y-4">
            <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-zinc-700 w-full"></div>
                <span className="absolute bg-zinc-900 px-4 text-sm text-zinc-500">или через</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {providers.map(({ name, color, icon: Icon }) => (
                    <button
                        key={name}
                        onClick={() => onSocialClick(name)}
                        className="flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 py-3.5 rounded-2xl font-medium transition-all active:scale-[0.985]"
                    >
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: color }}
                        >
                            <Icon size={18} className="text-white" />
                        </div>
                        <span>{name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}