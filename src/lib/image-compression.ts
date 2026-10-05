export interface CompressionOptions {
  /**
   * Mức chất lượng nén WebP (0.0 đến 1.0).
   * Mặc định: 0.85 (visually lossless, giảm sâu dung lượng nhưng không mất nét)
   */
  quality?: number;

  /**
   * Chiều dài cạnh lớn nhất của ảnh (pixel).
   * Tránh tràn RAM trình duyệt đối với ảnh chụp điện thoại độ phân giải siêu cao (48MP/64MP).
   * Mặc định: 2048
   */
  maxDimension?: number;

  /**
   * Ngưỡng dung lượng tối thiểu (bytes) để kích hoạt nén.
   * Nếu ảnh gốc nhỏ hơn ngưỡng này (mặc định 100KB), bỏ qua nén để tiết kiệm CPU.
   * Mặc định: 100 * 1024 (100KB)
   */
  minSizeToCompressBytes?: number;

  /**
   * Tự động giữ lại tệp gốc nếu kết quả nén có dung lượng lớn hơn hoặc bằng tệp gốc.
   * Mặc định: true
   */
  preserveSmallerOriginal?: boolean;
}

export interface CompressionResult {
  /** Tệp ảnh sau khi xử lý (WebP hoặc tệp gốc nếu tối ưu hơn) */
  file: File;
  /** Dung lượng ban đầu (bytes) */
  originalSize: number;
  /** Dung lượng sau nén (bytes) */
  compressedSize: number;
  /** Tỷ lệ phần trăm dung lượng tiết kiệm được (0 - 100%) */
  savedPercentage: number;
  /** Định dạng mime của tệp kết quả (ví dụ: 'image/webp') */
  mimeType: string;
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  quality: 0.85,
  maxDimension: 2048,
  minSizeToCompressBytes: 100 * 1024, // 100KB
  preserveSmallerOriginal: true,
};

/**
 * Kiểm tra xem tệp có phải là hình ảnh có thể nén được hay không
 */
export function isImageCompressible(file: File): boolean {
  if (!file) return false;
  if (file.type && file.type.startsWith('image/')) {
    // Không nén file SVG hoặc GIF động qua canvas vì sẽ mất hoạt họa/vector
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      return false;
    }
    return true;
  }
  const name = file.name.toLowerCase();
  return (
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.png') ||
    name.endsWith('.webp') ||
    name.endsWith('.heic') ||
    name.endsWith('.heif')
  );
}

/**
 * Nạp tệp ảnh vào phần tử có thể vẽ lên canvas (ImageBitmap hoặc HTMLImageElement)
 */
async function loadDrawableImage(file: File): Promise<{
  width: number;
  height: number;
  source: CanvasImageSource;
  cleanup?: () => void;
}> {
  // Thử dùng createImageBitmap nếu môi trường hỗ trợ
  if (typeof window !== 'undefined' && typeof window.createImageBitmap === 'function') {
    try {
      const bitmap = await window.createImageBitmap(file);
      return {
        width: bitmap.width,
        height: bitmap.height,
        source: bitmap,
        cleanup: () => {
          if (typeof bitmap.close === 'function') {
            bitmap.close();
          }
        },
      };
    } catch {
      // Fallback sang HTMLImageElement nếu createImageBitmap lỗi
    }
  }

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      reject(new Error('Môi trường không có DOM (window/document)'));
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      resolve({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        source: img,
        cleanup: () => {
          URL.revokeObjectURL(objectUrl);
        },
      });
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}

/**
 * Nén tệp hình ảnh sang định dạng WebP kèm thống kê dung lượng chi tiết.
 * Bảo toàn độ sắc nét, màu sắc và kênh trong suốt (alpha transparency).
 */
export async function compressImageWithStats(
  file: File,
  options?: CompressionOptions
): Promise<CompressionResult> {
  const mergedOptions: Required<CompressionOptions> = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const originalSize = file.size;

  // Nếu file không phải ảnh nén được hoặc quá nhẹ (< minSizeToCompressBytes)
  if (!isImageCompressible(file) || originalSize < mergedOptions.minSizeToCompressBytes) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      savedPercentage: 0,
      mimeType: file.type || 'image/jpeg',
    };
  }

  // Kiểm tra môi trường browser
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      savedPercentage: 0,
      mimeType: file.type || 'image/jpeg',
    };
  }

  let cleanup: (() => void) | undefined;
  try {
    const loaded = await loadDrawableImage(file);
    cleanup = loaded.cleanup;

    const { width, height, source } = loaded;

    if (!width || !height) {
      throw new Error('Không đọc được kích thước ảnh');
    }

    // Tính toán kích thước mới (giữ nguyên aspect ratio, giới hạn maxDimension)
    let targetWidth = width;
    let targetHeight = height;
    const maxDim = mergedOptions.maxDimension;

    if (width > maxDim || height > maxDim) {
      if (width >= height) {
        targetWidth = maxDim;
        targetHeight = Math.round((height * maxDim) / width);
      } else {
        targetHeight = maxDim;
        targetWidth = Math.round((width * maxDim) / height);
      }
    }

    // Vẽ lên canvas
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context không khả dụng');
    }

    // Thiết lập chất lượng nội suy mượt mà, sắc nét cao
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Vẽ ảnh (không fill nền trắng để bảo toàn alpha transparency của ảnh PNG)
    ctx.drawImage(source, 0, 0, targetWidth, targetHeight);

    // Xuất ra WebP Blob
    const compressedBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        'image/webp',
        mergedOptions.quality
      );
    });

    if (!compressedBlob) {
      throw new Error('Trình duyệt không thể tạo WebP Blob từ canvas');
    }

    const compressedSize = compressedBlob.size;

    // Cơ chế bảo vệ: Nếu sau khi nén dung lượng lại tăng hoặc bằng file gốc, giữ lại file gốc
    if (mergedOptions.preserveSmallerOriginal && compressedSize >= originalSize) {
      return {
        file,
        originalSize,
        compressedSize: originalSize,
        savedPercentage: 0,
        mimeType: file.type || 'image/jpeg',
      };
    }

    // Đổi tên file sang đuôi .webp
    const originalName = file.name || 'image';
    const newFileName = originalName.replace(/\.[^/.]+$/, '') + '.webp';
    const compressedFile = new File([compressedBlob], newFileName, {
      type: 'image/webp',
      lastModified: Date.now(),
    });

    const savedBytes = Math.max(0, originalSize - compressedSize);
    const savedPercentage = Number(((savedBytes / originalSize) * 100).toFixed(1));

    return {
      file: compressedFile,
      originalSize,
      compressedSize,
      savedPercentage,
      mimeType: 'image/webp',
    };
  } catch (err) {
    console.warn(`[Image Compression] Không thể nén tệp "${file.name}":`, err);
    // Fallback an toàn: trả về file gốc khi gặp bất kỳ lỗi nào
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      savedPercentage: 0,
      mimeType: file.type || 'image/jpeg',
    };
  } finally {
    cleanup?.();
  }
}

/**
 * Nén tệp hình ảnh sang WebP sắc nét (trả về trực tiếp File để truyền vào API/Cloudinary).
 * Tự động fallback về tệp gốc nếu xảy ra lỗi.
 */
export async function compressImageToWebP(
  file: File,
  options?: CompressionOptions
): Promise<File> {
  const result = await compressImageWithStats(file, options);
  return result.file;
}
