import {
  compressImageToWebP,
  compressImageWithStats,
  isImageCompressible,
} from './image-compression';

function createMockFile(name: string, size: number, type: string): File {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], name, { type });
}

describe('image-compression', () => {
  describe('isImageCompressible', () => {
    it('nhận diện đúng các định dạng ảnh thông dụng có thể nén', () => {
      expect(isImageCompressible(createMockFile('photo.jpg', 5000, 'image/jpeg'))).toBe(true);
      expect(isImageCompressible(createMockFile('photo.png', 5000, 'image/png'))).toBe(true);
      expect(isImageCompressible(createMockFile('photo.webp', 5000, 'image/webp'))).toBe(true);
      expect(isImageCompressible(createMockFile('photo.heic', 5000, 'image/heic'))).toBe(true);
    });

    it('từ chối các định dạng không nên nén qua canvas (gif động, svg vector, pdf)', () => {
      expect(isImageCompressible(createMockFile('anim.gif', 5000, 'image/gif'))).toBe(false);
      expect(isImageCompressible(createMockFile('icon.svg', 5000, 'image/svg+xml'))).toBe(false);
      expect(isImageCompressible(createMockFile('doc.pdf', 5000, 'application/pdf'))).toBe(false);
      expect(isImageCompressible(createMockFile('video.mp4', 5000, 'video/mp4'))).toBe(false);
    });
  });

  describe('compressImageWithStats & compressImageToWebP', () => {
    let originalCreateObjectURL: typeof URL.createObjectURL;
    let originalRevokeObjectURL: typeof URL.revokeObjectURL;

    beforeEach(() => {
      originalCreateObjectURL = window.URL.createObjectURL;
      originalRevokeObjectURL = window.URL.revokeObjectURL;
      window.URL.createObjectURL = jest.fn(() => 'blob:mock-preview-url');
      window.URL.revokeObjectURL = jest.fn();
    });

    afterEach(() => {
      window.URL.createObjectURL = originalCreateObjectURL;
      window.URL.revokeObjectURL = originalRevokeObjectURL;
      jest.restoreAllMocks();
    });

    it('bỏ qua nén và giữ nguyên tệp nếu dung lượng nhỏ hơn minSizeToCompressBytes (100KB)', async () => {
      const smallFile = createMockFile('small.jpg', 50 * 1024, 'image/jpeg'); // 50KB
      const result = await compressImageWithStats(smallFile);

      expect(result.file).toBe(smallFile);
      expect(result.compressedSize).toBe(smallFile.size);
      expect(result.savedPercentage).toBe(0);
    });

    it('bỏ qua nén và giữ nguyên tệp nếu tệp không phải ảnh', async () => {
      const pdfFile = createMockFile('doc.pdf', 500 * 1024, 'application/pdf');
      const result = await compressImageWithStats(pdfFile);

      expect(result.file).toBe(pdfFile);
      expect(result.savedPercentage).toBe(0);
    });

    it('nén thành công ảnh lớn sang định dạng WebP với dung lượng giảm sâu', async () => {
      const largeFile = createMockFile('dress.jpg', 3 * 1024 * 1024, 'image/jpeg'); // 3MB

      // Mock HTMLImageElement load
      const mockNaturalWidth = 3000;
      const mockNaturalHeight = 4000;
      jest.spyOn(window, 'Image').mockImplementation(() => {
        const img = {} as any;
        setTimeout(() => {
          img.naturalWidth = mockNaturalWidth;
          img.naturalHeight = mockNaturalHeight;
          img.width = mockNaturalWidth;
          img.height = mockNaturalHeight;
          img.onload?.();
        }, 10);
        return img;
      });

      // Mock Canvas 2D Context & toBlob
      const mockContext = {
        drawImage: jest.fn(),
        imageSmoothingEnabled: false,
        imageSmoothingQuality: 'low',
      };
      jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockContext as any);

      const mockCompressedBlobSize = 600 * 1024; // 600KB (giảm 80%)
      jest.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback, type, quality) => {
        expect(type).toBe('image/webp');
        expect(quality).toBe(0.85);
        const blob = new Blob([new ArrayBuffer(mockCompressedBlobSize)], { type: 'image/webp' });
        callback(blob);
      });

      const stats = await compressImageWithStats(largeFile);

      expect(stats.file.name).toBe('dress.webp');
      expect(stats.file.type).toBe('image/webp');
      expect(stats.originalSize).toBe(3 * 1024 * 1024);
      expect(stats.compressedSize).toBe(mockCompressedBlobSize);
      expect(stats.savedPercentage).toBeGreaterThan(70);
      expect(mockContext.imageSmoothingEnabled).toBe(true);
      expect(mockContext.imageSmoothingQuality).toBe('high');

      // Test helper compressImageToWebP
      const fileOnly = await compressImageToWebP(largeFile);
      expect(fileOnly.name).toBe('dress.webp');
      expect(fileOnly.type).toBe('image/webp');
    });

    it('điều chỉnh co tỉ lệ (downscale) kích thước cạnh tối đa khi ảnh vượt quá maxDimension (2048px)', async () => {
      const largeFile = createMockFile('banner.png', 2 * 1024 * 1024, 'image/png');

      jest.spyOn(window, 'Image').mockImplementation(() => {
        const img = {} as any;
        setTimeout(() => {
          img.naturalWidth = 4096;
          img.naturalHeight = 2048;
          img.onload?.();
        }, 10);
        return img;
      });

      let canvasWidth = 0;
      let canvasHeight = 0;
      jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (this: HTMLCanvasElement) {
        canvasWidth = this.width;
        canvasHeight = this.height;
        return {
          drawImage: jest.fn(),
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high',
        } as any;
      });

      jest.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
        const blob = new Blob([new ArrayBuffer(500 * 1024)], { type: 'image/webp' });
        callback(blob);
      });

      await compressImageWithStats(largeFile, { maxDimension: 2048 });

      // Chiều rộng 4096px bị co về 2048px, chiều cao 2048px co tỉ lệ về 1024px
      expect(canvasWidth).toBe(2048);
      expect(canvasHeight).toBe(1024);
    });

    it('tự động giữ nguyên tệp gốc nếu kết quả nén có dung lượng lớn hơn hoặc bằng tệp gốc (preserveSmallerOriginal)', async () => {
      const alreadyOptimizedFile = createMockFile('optimized.jpg', 150 * 1024, 'image/jpeg'); // 150KB

      jest.spyOn(window, 'Image').mockImplementation(() => {
        const img = {} as any;
        setTimeout(() => {
          img.naturalWidth = 800;
          img.naturalHeight = 600;
          img.onload?.();
        }, 10);
        return img;
      });

      jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
        drawImage: jest.fn(),
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      } as any);

      // Giả sử nén ra 200KB (lớn hơn 150KB gốc)
      jest.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
        const largerBlob = new Blob([new ArrayBuffer(200 * 1024)], { type: 'image/webp' });
        callback(largerBlob);
      });

      const result = await compressImageWithStats(alreadyOptimizedFile, {
        preserveSmallerOriginal: true,
      });

      expect(result.file).toBe(alreadyOptimizedFile);
      expect(result.compressedSize).toBe(alreadyOptimizedFile.size);
      expect(result.savedPercentage).toBe(0);
    });

    it('fallback an toàn về tệp gốc khi gặp lỗi giải mã ảnh', async () => {
      const corruptedFile = createMockFile('broken.jpg', 500 * 1024, 'image/jpeg');

      jest.spyOn(window, 'Image').mockImplementation(() => {
        const img = {} as any;
        setTimeout(() => {
          img.onerror?.(new Error('Decode error'));
        }, 10);
        return img;
      });

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const result = await compressImageToWebP(corruptedFile);
      expect(result).toBe(corruptedFile);
      consoleWarnSpy.mockRestore();
    });
  });
});
