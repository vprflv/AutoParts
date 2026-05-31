// import { describe, it, expect, vi } from 'vitest';
// import { useBulkPhotoUpload } from '../useBulkPhotoUpload';
//
// // ==================== МОК SUPABASE ====================
// vi.mock('@/lib/supabase/client', () => {
//     const mockClient = {
//         from: vi.fn().mockReturnThis(),
//         select: vi.fn(),
//         update: vi.fn().mockReturnThis(),
//         eq: vi.fn().mockResolvedValue({ error: null }),
//         storage: {
//             from: vi.fn().mockReturnThis(),
//             upload: vi.fn().mockResolvedValue({ data: { path: 'test.jpg' }, error: null }),
//             getPublicUrl: vi.fn().mockReturnValue({
//                 data: { publicUrl: 'https://fake.supabase.co/test.jpg' }
//             }),
//         },
//     };
//
//     return { createClient: vi.fn(() => mockClient) };
// });
//
// describe('useBulkPhotoUpload', () => {
//     it('должен находить товары по OEM и загружать фото', async () => {
//         const { mutateAsync } = useBulkPhotoUpload();
//
//         const mockSupabase = (await import('@/lib/supabase/client')).createClient() as any;
//         mockSupabase.select.mockResolvedValueOnce({
//             data: [{ oem: '25548TGE', images: [] }],
//             error: null,
//         });
//
//         const files = [new File([''], '25548TGE.jpg', { type: 'image/jpeg' })];
//
//         const result = await mutateAsync(files);
//
//         expect(result.updated).toBe(1);
//     });
//
//     it('должен пропускать файлы без OEM', async () => {
//         const { mutateAsync } = useBulkPhotoUpload();
//
//         const files = [new File([''], 'no-oem-file.jpg', { type: 'image/jpeg' })];
//
//         const result = await mutateAsync(files);
//
//         expect(result.skipped).toBe(1);
//     });
// });