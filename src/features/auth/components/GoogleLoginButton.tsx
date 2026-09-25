"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { buildGoogleAuthUrl, saveReturnUrl } from "../utils/google-auth.utils";

interface GoogleLoginButtonProps {
  label?: string;
  returnUrl?: string;
  className?: string;
  disabled?: boolean;
}

export function GoogleLoginButton({
  label = "Tiếp tục với Google",
  returnUrl,
  className = "",
  disabled = false,
}: GoogleLoginButtonProps) {
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (disabled || isRedirecting) return;

    setIsRedirecting(true);

    // Save returnUrl if provided directly, or extract from query parameters (?returnUrl= or ?from= or ?redirect=)
    const effectiveReturnUrl =
      returnUrl ||
      searchParams.get("returnUrl") ||
      searchParams.get("from") ||
      searchParams.get("redirect") ||
      undefined;

    if (effectiveReturnUrl) {
      saveReturnUrl(effectiveReturnUrl);
    }

    // Trigger full browser redirect to backend OAuth entry point
    const targetUrl = buildGoogleAuthUrl();
    window.location.href = targetUrl;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isRedirecting}
      aria-label="Đăng nhập bằng Google"
      className={`relative w-full h-12 px-5 py-3 rounded-full border border-border bg-card/60 backdrop-blur-sm text-foreground font-inter text-[14px] sm:text-[15px] font-medium flex items-center justify-center gap-3 transition-all duration-300 ease-out hover:bg-muted/70 hover:border-primary/40 hover:shadow-md active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed group ${className}`}
    >
      {isRedirecting ? (
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-muted-foreground font-medium text-[14px]">
            Đang kết nối tới Google...
          </span>
        </div>
      ) : (
        <>
          {/* Official Google G Logo */}
          <svg
            className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.09C3.26 21.3 7.32 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.26C.46 8.18 0 9.99 0 12s.46 3.82 1.26 5.41l4.02-3.09z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.26 2.7 1.26 6.59l4.02 3.09c.95-2.83 3.6-4.93 6.72-4.93z"
            />
          </svg>
          <span className="truncate">{label}</span>
        </>
      )}
    </button>
  );
}
