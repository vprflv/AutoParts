import { describe, it, expect, vi, beforeEach } from 'vitest';
import { bulkPhotoUploadFn } from '../useBulkPhotoUpload';

// ==================== КОРРЕКТНЫЙ МОК SUPABASE ====================
vi.mock('@/lib/supabase/client', () => {
    const mockClient = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn(),
        update: vi.fn().mockReturnThis(),           // возвращает this для цепочки
        eq: vi.fn().mockResolvedValue({ error: null }), // ← важно!
        storage: {
            from: vi.fn().mockReturnThis(),
            upload: vi.fn().mockResolvedValue({
                data: { path: 'test-image.jpg' },
                error: null
            }),
            getPublicUrl: vi.fn().mockReturnValue({
                data: { publicUrl: 'https://fake.supabase.co/test.jpg' }
            }),
        },
    };

    return { createClient: vi.fn(() => mockClient) };
});

describe('bulkPhotoUploadFn', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('должен находить товар по OEM и успешно загружать фото', async () => {
        const supabase = (await import('@/lib/supabase/client')).createClient() as any;

        supabase.select.mockResolvedValueOnce({
            data: [{ oem: '25548TGE', images: [] }],
            error: null,
        });

        const files = [
            new File(['dummy'], '25548TGE.jpg', { type: 'image/jpeg' }),
            new File(['dummy'], '25548TGE_2.png', { type: 'image/png' }),
        ];

        const result = await bulkPhotoUploadFn(files);

        expect(result.updated).toBe(1);
        expect(result.skipped).toBe(0);
        expect(result.errors).toBe(0);
    });

    it('должен пропускать файлы без OEM в названии', async () => {
        const supabase = (await import('@/lib/supabase/client')).createClient() as any;

        supabase.select.mockResolvedValueOnce({
            data: [{ oem: '25548TGE', images: [] }],
            error: null,
        });

        const files = [
            new File(['dummy'], 'random-photo-no-oem.jpg', { type: 'image/jpeg' }),
        ];

        const result = await bulkPhotoUploadFn(files);

        expect(result.skipped).toBe(1);
        expect(result.updated).toBe(0);
    });

    it('должен обрабатывать несколько разных OEM', async () => {
        const supabase = (await import('@/lib/supabase/client')).createClient() as any;

        supabase.select.mockResolvedValueOnce({
            data: [
                { oem: '25548TGE', images: [] },
                { oem: 'ABC123', images: [] },
            ],
            error: null,
        });

        const files = [
            new File([''], '25548TGE.jpg', { type: 'image/jpeg' }),
            new File([''], 'ABC123-part.png', { type: 'image/png' }),
            new File([''], 'unknown.jpg', { type: 'image/jpeg' }),
        ];

        const result = await bulkPhotoUploadFn(files);

        expect(result.updated).toBe(2);
        expect(result.skipped).toBe(1);
    });
});