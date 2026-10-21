import { CommunityUserRes } from '../types';

export interface MediaValidationResult {
  isValid: boolean;
  error?: string;
  mediaType?: 'image' | 'video';
}

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm'];

export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100MB
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_DURATION_SECONDS = 60;

/**
 * Kiểm tra tính hợp lệ của tệp hình ảnh hoặc video tải lên theo giới hạn kỹ thuật của backend 022
 * - Ảnh: <= 10MB, định dạng jpg, png, webp
 * - Video: <= 100MB, <= 60s, định dạng mp4, webm
 */
export async function validateMediaFile(file: File): Promise<MediaValidationResult> {
  const fileName = (file.name || '').toLowerCase();
  const isVideoExt = ['.mp4', '.webm', '.mov', '.avi', '.mkv'].some((ext) => fileName.endsWith(ext));
  const isVideo = file.type.startsWith('video/') || isVideoExt;

  // 1. Kiểm tra nếu là tệp Video
  if (isVideo) {
    // Ưu tiên cao nhất: Kiểm tra dung lượng video > 100MB (chặn trước khi đọc metadata)
    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      return {
        isValid: false,
        error: `Video "${file.name}" vượt quá dung lượng tối đa 100MB.`,
      };
    }

    // Kiểm tra định dạng video được hỗ trợ (chỉ mp4, webm)
    const isSupportedVideo =
      VIDEO_MIME_TYPES.includes(file.type) ||
      fileName.endsWith('.mp4') ||
      fileName.endsWith('.webm');

    if (!isSupportedVideo) {
      return {
        isValid: false,
        error: 'Video chỉ hỗ trợ định dạng mp4, webm.',
      };
    }

    // Kiểm tra thời lượng video <= 60 giây
    try {
      const duration = await getVideoDuration(file);
      if (duration > MAX_VIDEO_DURATION_SECONDS) {
        return {
          isValid: false,
          error: `Thời lượng video "${file.name}" là ${Math.round(duration)}s, vượt quá giới hạn tối đa 60 giây.`,
        };
      }
    } catch (err) {
      console.warn('Không thể đọc thời lượng video:', err);
    }

    return {
      isValid: true,
      mediaType: 'video',
    };
  }

  // 2. Kiểm tra nếu là tệp Ảnh
  const isImageExt = ['.jpg', '.jpeg', '.png', '.webp'].some((ext) => fileName.endsWith(ext));
  const isImage = IMAGE_MIME_TYPES.includes(file.type) || (file.type.startsWith('image/') && isImageExt);

  if (isImage) {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return {
        isValid: false,
        error: `Ảnh "${file.name}" vượt quá dung lượng tối đa 10MB.`,
      };
    }
    return {
      isValid: true,
      mediaType: 'image',
    };
  }

  if (file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'Ảnh chỉ hỗ trợ định dạng jpg, png, webp.',
    };
  }

  return {
    isValid: false,
    error:
      'Định dạng tệp không được hỗ trợ. Vui lòng chọn ảnh (jpg, png, webp) hoặc video (mp4, webm).',
  };
}

function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return resolve(0);
    }
    const video = document.createElement('video');
    video.preload = 'metadata';
    const objectUrl = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(video.duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Lỗi khi tải metadata video'));
    };

    video.src = objectUrl;
  });
}

/**
 * Lấy avatar của CommunityUser với cơ chế phòng thủ khi user = null hoặc avatarUrl rỗng
 */
export function getCommunityUserAvatar(user?: CommunityUserRes | null): string {
  if (!user || !user.avatarUrl) {
    return '/avatar-default.jpg';
  }
  return user.avatarUrl;
}

/**
 * Lấy tên hiển thị của CommunityUser với cơ chế phòng thủ
 */
export function getCommunityUserDisplayName(user?: CommunityUserRes | null): string {
  if (!user) {
    return 'Người dùng ẩn danh';
  }
  if (user.firstName && user.lastName) {
    return `${user.lastName} ${user.firstName}`.trim();
  }
  if (user.firstName) return user.firstName;
  if (user.username) return user.username;
  return 'Người dùng';
}

/**
 * Lấy chữ cái đại diện Avatar Fallback
 */
export function getCommunityUserInitials(user?: CommunityUserRes | null): string {
  if (!user) return 'U';
  if (user.firstName) return user.firstName[0].toUpperCase();
  if (user.username) return user.username[0].toUpperCase();
  return 'U';
}

/**
 * Map số giới tính sang nhãn hiển thị tiếng Việt
 * 1 = Nam, 2 = Nữ, 3 = Khác; vắng/0 = Không xác định
 */
export function formatGenderLabel(gender?: number): string {
  switch (gender) {
    case 1:
      return 'Nam';
    case 2:
      return 'Nữ';
    case 3:
      return 'Khác';
    default:
      return '';
  }
}
