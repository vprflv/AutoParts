"use client";

import { useState } from "react";
import { ShoppingCart, User, Menu } from "lucide-react";
import { useCartStore } from "@/src/store/useCartStore";

import CartDrawer from "./CartModal";
import AuthModal from "./AuthModal";
import SearchInput from "@/src/features/Navbar/components/SearchInput";

interface NavbarProps {
    onSearchChange: (search: string) => void;
    searchValue: string;
}

export default function Navbar({ onSearchChange, searchValue }: NavbarProps) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    const totalItems = useCartStore((state) => state.totalItems());



    return (
        <>
            <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Логотип */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-3xl flex items-center justify-center text-2xl">
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">PartsName</h1>
                            <p className="text-xs text-zinc-500 -mt-1">commerce</p>
                        </div>
                    </div>

                    {/* Поиск */}
                    <SearchInput
                        value={searchValue}
                        onChange={onSearchChange}
                    />

                    {/* Иконки */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-3 hover:bg-zinc-900 rounded-2xl transition-colors"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {totalItems > 0 && (
                                <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center">
                                    {totalItems}
                                </div>
                            )}
                        </button>

                        <button
                            onClick={() => setIsAuthOpen(true)}
                            className="p-3 hover:bg-zinc-900 rounded-2xl transition-colors"
                        >
                            <User className="w-6 h-6" />
                        </button>

                        <button className="md:hidden p-3 hover:bg-zinc-900 rounded-2xl transition-colors">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </nav>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
}