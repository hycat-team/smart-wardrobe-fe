import {
  FileValidationOptions,
  FileValidationResult,
  RejectedFileItem,
} from '../types/dropzone';

export const DEFAULT_MAX_FILES = 5;
export const DEFAULT_MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const DEFAULT_ACCEPTED_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.heic',
  '.heif',
];

export function isImageFile(
  file: File,
  acceptedExtensions = DEFAULT_ACCEPTED_EXTENSIONS
): boolean {
  if (file.type && file.type.startsWith('image/')) {
    return true;
  }
  const fileName = file.name.toLowerCase();
  return acceptedExtensions.some((ext) => fileName.endsWith(ext));
}

export function validateDroppedFiles(
  incomingFiles: File[],
  options?: FileValidationOptions
): FileValidationResult {
  const maxFiles = options?.maxFiles ?? DEFAULT_MAX_FILES;
  const maxSizeBytes = options?.maxSizeBytes ?? DEFAULT_MAX_SIZE_BYTES;
  const acceptedExtensions =
    options?.acceptedExtensions ?? DEFAULT_ACCEPTED_EXTENSIONS;
  const currentCount = options?.currentCount ?? 0;
  const existingFiles = options?.existingFiles ?? [];

  const acceptedFiles: File[] = [];
  const rejectedFiles: RejectedFileItem[] = [];

  const availableSlots = Math.max(0, maxFiles - currentCount);

  if (availableSlots <= 0 && incomingFiles.length > 0) {
    incomingFiles.forEach((file) => {
      rejectedFiles.push({
        file,
        reason: 'EXCEEDS_COUNT',
        message: 'Bạn đã chọn đủ 5 ảnh. Không thể thêm ảnh mới!',
      });
    });
    return { acceptedFiles, rejectedFiles };
  }

  const validCandidateFiles: File[] = [];

  for (const file of incomingFiles) {
    // 1. Check if file is an image
    if (!isImageFile(file, acceptedExtensions)) {
      rejectedFiles.push({
        file,
        reason: 'INVALID_TYPE',
        message: `Tệp "${file.name}" không phải ảnh hợp lệ (chỉ hỗ trợ PNG, JPG, JPEG, WEBP, HEIC).`,
      });
      continue;
    }

    // 2. Check file size
    if (file.size > maxSizeBytes) {
      rejectedFiles.push({
        file,
        reason: 'EXCEEDS_SIZE',
        message: `Ảnh "${file.name}" vượt quá dung lượng tối đa 5MB.`,
      });
      continue;
    }

    // 3. Check duplicate
    const isDuplicate = existingFiles.some(
      (existing) =>
        existing.name === file.name &&
        existing.size === file.size &&
        existing.lastModified === file.lastModified
    );
    if (isDuplicate) {
      rejectedFiles.push({
        file,
        reason: 'DUPLICATE_FILE',
        message: `Ảnh "${file.name}" đã có trong danh sách và được bỏ qua.`,
      });
      continue;
    }

    validCandidateFiles.push(file);
  }

  // 4. Capacity slicing
  if (validCandidateFiles.length <= availableSlots) {
    acceptedFiles.push(...validCandidateFiles);
  } else {
    const acceptedSlice = validCandidateFiles.slice(0, availableSlots);
    const excessSlice = validCandidateFiles.slice(availableSlots);

    acceptedFiles.push(...acceptedSlice);

    const excessMessage = `Đã nhận thêm ${acceptedSlice.length} ảnh để đạt giới hạn 5 ảnh. ${excessSlice.length} ảnh vượt quá đã được bỏ qua.`;
    excessSlice.forEach((file) => {
      rejectedFiles.push({
        file,
        reason: 'EXCEEDS_COUNT',
        message: excessMessage,
      });
    });
  }

  return { acceptedFiles, rejectedFiles };
}
