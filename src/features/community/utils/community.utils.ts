import { CommunityUserRes } from '../types';

export interface MediaValidationResult {
  isValid: boolean;
  error?: string;
  mediaType?: 'image' | 'video';
}

/**
 * Kiểm tra tính hợp lệ của tệp hình ảnh hoặc video tải lên theo giới hạn kỹ thuật của backend 022
 * - Ảnh: <= 10MB, định dạng jpg, png, webp
 * - Video: <= 100MB, <= 60s, định dạng mp4, webm
 */
export async function validateMediaFile(file: File): Promise<MediaValidationResult> {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (!isImage && !isVideo) {
    return {
      isValid: false,
      error: 'Định dạng tệp không được hỗ trợ. Vui lòng chọn ảnh (jpg, png, webp) hoặc video (mp4, webm).',
    };
  }

  // 1. Kiểm tra ảnh
  if (isImage) {
    const maxImageSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxImageSize) {
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

  // 2. Kiểm tra video
  if (isVideo) {
    const maxVideoSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxVideoSize) {
      return {
        isValid: false,
        error: `Video "${file.name}" vượt quá dung lượng tối đa 100MB.`,
      };
    }

    // Kiểm tra thời lượng video <= 60 giây
    try {
      const duration = await getVideoDuration(file);
      if (duration > 60) {
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

  return { isValid: false, error: 'Tệp không hợp lệ.' };
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
