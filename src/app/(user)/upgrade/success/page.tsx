"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useAuthStore } from "@/store/useAuthStore";

export default function UpgradeSuccess() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
    // Switch to premium mock user
    login("premium");
  }, [login]);

  return (
    <div className="min-h-full bg-[#0E0E0E] text-[#F5F5F5] flex items-center justify-center p-6 animate-in zoom-in duration-700">
      <div className="max-w-md w-full text-center space-y-8 relative">
        
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="relative z-10 space-y-6">
          <div className="mx-auto size-24 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-8 relative">
            <Sparkles className="absolute -top-2 -right-2 size-6 text-primary animate-pulse" />
            <Crown className="size-10 text-primary" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-heading font-medium text-primary">Chào Mừng Đến Với Atelier</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Thanh toán thành công! Tài khoản của bạn đã được nâng cấp lên hạng Premium.
              Hãy sẵn sàng trải nghiệm tủ đồ thông minh không giới hạn.
            </p>
          </div>

          <div className="pt-8">
            <Button 
              onClick={() => router.push("/dashboard")}
              className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-mono tracking-widest uppercase font-bold text-xs"
            >
              Vào Tủ Đồ Ngay
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}


