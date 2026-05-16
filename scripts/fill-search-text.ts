import { prisma } from "@/src/lib/prisma";

async function fillSearchText() {
    console.log("🚀 Заполняем searchText для всех товаров...");

    const products = await prisma.product.findMany({
        select: { id: true, name: true, oem: true, brand: true, crossNumbers: true }
    });

    let updated = 0;

    for (const p of products) {
        const parts = [
            p.name,
            p.oem,
            p.brand,
            ...(p.crossNumbers || [])
        ].filter(Boolean);

        const searchText = parts.join(" | ");

        await prisma.product.update({
            where: { id: p.id },
            data: { searchText }
        });

        updated++;
        if (updated % 100 === 0) console.log(`Обработано: ${updated}`);
    }

    console.log(`✅ Готово! Обновлено товаров: ${updated}`);
}

fillSearchText()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });