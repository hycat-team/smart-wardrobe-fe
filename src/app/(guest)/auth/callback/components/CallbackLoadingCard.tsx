"use client";

import React from "react";
import Image from "next/image";

interface CallbackLoadingCardProps {
  message?: string;
  subMessage?: string;
}

export function CallbackLoadingCard({
  message = "Đang hoàn tất đăng nhập...",
  subMessage = "Vui lòng đợi trong giây lát, Closy đang xác thực phiên làm việc của bạn.",
}: CallbackLoadingCardProps) {
  return (
    <div className="w-full px-6 py-12 sm:px-10 sm:py-14 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
      {/* Brand Icon with Gentle Glow */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-125 animate-pulse" />
        <div className="relative w-16 h-16 rounded-2xl bg-muted/60 border border-border/80 flex items-center justify-center shadow-lg p-3">
          <Image
            src="/brand/logo-only.png"
            alt="Closy Logo"
            width={44}
            height={44}
            className="w-11 h-11 object-contain"
            priority
          />
        </div>
      </div>

      {/* Spinner & Message */}
      <div className="space-y-3 max-w-xs">
        <h2 className="font-playfair text-[24px] sm:text-[28px] font-semibold text-foreground tracking-tight">
          {message}
        </h2>
        <p className="font-inter text-[13px] sm:text-[14px] text-muted-foreground leading-relaxed">
          {subMessage}
        </p>
      </div>

      {/* Elegant Progress Spinner Bar */}
      <div className="mt-8 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
      </div>
    </div>
  );
}
