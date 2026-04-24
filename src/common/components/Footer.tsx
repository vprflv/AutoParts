// src/components/Footer.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function Footer() {
    const [year] = useState(new Date().getFullYear());

    return (
        <footer className="bg-zinc-950 border-t border-zinc-800 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">

                    {/* Логотип и описание */}

                    {/* Навигация */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Навигация</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link href="/products" className="hover:text-white transition-colors">Каталог</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Акции</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Доставка</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Контакты</Link></li>
                        </ul>
                    </div>

                    {/* Помощь */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Помощь</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link href="#" className="hover:text-white transition-colors">Как сделать заказ</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Гарантия</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Возврат товара</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Контакты */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Контакты</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li>📞 +7 (999) 123-45-67</li>
                            <li>✉️ info@autopart.pro</li>
                            <li>🕒 Пн–Пт: 9:00 – 20:00</li>
                            <li>Сб: 10:00 – 18:00</li>
                        </ul>
                    </div>
                </div>

                {/* Нижняя часть */}
                <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
                    <p>© {year} AutoPart Pro. Все права защищены.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-zinc-400 transition-colors">Политика конфиденциальности</Link>
                        <Link href="#" className="hover:text-zinc-400 transition-colors">Условия использования</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}