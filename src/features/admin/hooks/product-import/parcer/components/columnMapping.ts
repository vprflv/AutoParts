export function getColumnMap(headers: any[]): Record<string, number> {
    const map: Record<string, number> = {};
    const texts = headers.map(h => String(h || '').toLowerCase().trim());

    const rules: [string, string[]][] = [
        ['oem', ['oem', 'артикул', 'код', 'article']],
        ['name', ['название', 'наименование', 'name']],
        ['brand', ['бренд', 'brand', 'производитель']],
        ['price', ['цена', 'price']],
        ['stock', ['остаток', 'stock', 'количество']],
        ['category', ['категория', 'category']],
        ['description', ['описание', 'description']],
        ['applicability', ['применяемость', 'applicability']],
        ['analogs', ['аналоги', 'cross', 'аналог']],
        ['specifications', ['характеристики', 'specifications', 'specs', 'параметры']],
    ];

    for (const [key, keywords] of rules) {
        for (let i = 0; i < texts.length; i++) {
            if (keywords.some(k => texts[i].includes(k))) {
                map[key] = i;
                break;
            }
        }
    }
    return map;
}