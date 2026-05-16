

export const usePagination = () => {
    function getPaginationRange(currentPage: number, totalPages: number): (number | string)[] {
        const range: (number | string)[] = [];

        // Всегда добавляем первую страницу
        range.push(1);

        // Определяем границы для отображения соседних страниц
        const leftBound = Math.max(2, currentPage - 2);
        const rightBound = Math.min(totalPages - 1, currentPage + 2);

        // Добавляем эллипс, если между 1 и левой границей есть пропуски
        if (leftBound > 2) {
            range.push('...');
        }

        // Добавляем страницы в диапазоне [leftBound, rightBound]
        for (let i = leftBound; i <= rightBound; i++) {
            range.push(i);
        }

        // Добавляем эллипс, если между правой границей и последней страницей есть пропуски
        if (rightBound < totalPages - 1) {
            range.push('...');
        }

        // Всегда добавляем последнюю страницу, если она не совпадает с первой
        if (totalPages > 1) {
            range.push(totalPages);
        }

        return range;
    }

    return {getPaginationRange}
};