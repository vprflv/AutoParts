import cron from 'node-cron';
import { prisma } from '@/src/lib/prisma';

export function startMagicTokenCleanup() {

    cron.schedule('0 */6 * * *', async () => {
        try {
            const now = new Date();
            const deleted = await prisma.magicToken.deleteMany({
                where: {
                    OR: [
                        { expiresAt: { lt: now } },
                        { used: true }
                    ]
                }
            });

            console.log(`[Cron] Очищено MagicToken: ${deleted.count} шт. в ${now.toISOString()}`);
        } catch (error) {
            console.error(' Ошибка очистки MagicToken:', error);
        }
    });

    console.log('✅ Cron-задача очистки MagicToken запущена');
}