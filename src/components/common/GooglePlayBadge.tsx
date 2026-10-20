import React from 'react';

export interface GooglePlayBadgeProps {
  /**
   * Tùy chọn URL đích (mặc định lấy liên kết chính thức của Closy trên Google Play Store)
   */
  href?: string;

  /**
   * Các class Tailwind CSS bổ sung cho container nút
   */
  className?: string;

  /**
   * Ngôn ngữ hiển thị nhãn: 'vi' (TẢI TRÊN) | 'en' (GET IT ON)
   * Mặc định: 'vi'
   */
  locale?: 'vi' | 'en';

  /**
   * Kích thước nút: 'sm' | 'md' | 'lg'
   * Mặc định: 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Nhãn trợ năng tùy chỉnh (mặc định tự động sinh theo ngôn ngữ)
   */
  ariaLabel?: string;

  /**
   * Callback khi người dùng nhấp vào nút
   */
  onClick?: () => void;
}

export const OFFICIAL_GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=online.hycat.closy&pcampaignid=web_share';

export function GooglePlayBadge({
  href = OFFICIAL_GOOGLE_PLAY_URL,
  className = '',
  locale = 'vi',
  size = 'md',
  ariaLabel,
  onClick,
}: GooglePlayBadgeProps) {
  const subtitle = locale === 'en' ? 'GET IT ON' : 'TẢI TRÊN';
  const defaultAriaLabel =
    locale === 'en'
      ? 'Get Closy on Google Play'
      : 'Tải ứng dụng Closy trên Google Play';

  // Size configurations
  const sizeStyles = {
    sm: {
      container: 'px-3.5 py-2 rounded-lg gap-2.5',
      icon: 'w-5 h-5 min-w-[20px]',
      subtitle: 'text-[9px]',
      title: 'text-xs',
    },
    md: {
      container: 'px-4 py-2.5 rounded-xl gap-3.5',
      icon: 'w-6 h-6 min-w-[24px]',
      subtitle: 'text-[10px]',
      title: 'text-sm sm:text-base',
    },
    lg: {
      container: 'px-5 py-3 rounded-2xl gap-4',
      icon: 'w-7 h-7 min-w-[28px]',
      subtitle: 'text-[11px]',
      title: 'text-base sm:text-lg',
    },
  }[size];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel || defaultAriaLabel}
      onClick={onClick}
      className={`group inline-flex items-center select-none bg-[#0D0D0D] text-white border border-white/15 
        hover:border-[#D9C5B2]/60 hover:bg-[#1A1A1A] hover:scale-[1.02] active:scale-[0.98] 
        transition-all duration-300 ease-out shadow-sm hover:shadow-[0_4px_24px_rgba(217,197,178,0.18)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9C5B2] 
        focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] ${sizeStyles.container} ${className}`}
    >
      {/* Official Google Play Vector SVG Icon */}
      <svg
        viewBox="0 0 24 24"
        className={`${sizeStyles.icon} shrink-0 transition-transform duration-300 group-hover:scale-105`}
        aria-hidden="true"
      >
        <path
          fill="#4285F4"
          d="M3.609 1.814c-.234.36-.364.794-.364 1.258v17.856c0 .464.13.898.365 1.258l10.183-10.186L3.609 1.814z"
        />
        <path
          fill="#34A853"
          d="M17.156 8.637L13.793 12 3.609 1.814c.386-.442.95-.724 1.58-.724.368 0 .717.098 1.02.272l10.947 7.275z"
        />
        <path
          fill="#EA4335"
          d="M17.156 15.363l-10.947 7.275c-.303.174-.652.272-1.02.272-.63 0-1.194-.282-1.58-.724L13.793 12l3.363 3.363z"
        />
        <path
          fill="#FBBC04"
          d="M21.05 10.742l-3.894-2.585L13.793 12l3.363 3.363 3.894-2.585c.66-.438 1.05-1.17 1.05-1.978 0-.808-.39-1.54-1.05-1.978z"
        />
      </svg>

      {/* Typography */}
      <div className="flex flex-col text-left leading-none justify-center">
        <span
          className={`${sizeStyles.subtitle} uppercase font-medium tracking-wider text-[#A3A3A3] group-hover:text-[#D9C5B2] transition-colors`}
        >
          {subtitle}
        </span>
        <span
          className={`${sizeStyles.title} font-semibold text-white tracking-wide font-sans mt-0.5`}
        >
          Google Play
        </span>
      </div>
    </a>
  );
}

export default GooglePlayBadge;
