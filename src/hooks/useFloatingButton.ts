// src/hooks/useFloatingButton.ts
import { useState, useEffect } from "react";

export function useFloatingButton() {
    const [showFloatingButton, setShowFloatingButton] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const pagination = document.getElementById("pagination");
            if (!pagination) return;

            const paginationRect = pagination.getBoundingClientRect();

            // === Настройка здесь ===
            const triggerPoint = window.innerHeight * 1; // было 0.8 — теперь раньше
            const isNearPagination = paginationRect.top < triggerPoint;

            setShowFloatingButton(!isNearPagination);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        // Вызываем сразу при монтировании
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return showFloatingButton;
}