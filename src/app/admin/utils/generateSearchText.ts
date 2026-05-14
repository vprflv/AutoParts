export function generateSearchText(product: any): string {
    const parts = [
        product.name,
        product.oem,
        product.brand,
        ...(product.crossNumbers
            ? String(product.crossNumbers).split(/[;,|]/).map((s: string) => s.trim())
            : [])
    ].filter(Boolean);

    return parts.join(" | ");
}