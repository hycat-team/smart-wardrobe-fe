"use client";
import { Sparkles, CheckCircle2, Zap, ArrowRight, ShieldCheck, Crown, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useDailyQuota, useToggleAutoRenew } from "@/features/subscription/queries/subscription.queries";

export default function BillingSettings() {
  const user = useAuthStore((state) => state.user);
  const isPremium = user?.isPremium;
  const router = useRouter();

  const { data: quota, isLoading: isLoadingQuota } = useDailyQuota();
  const { mutate: toggleAutoRenew, isPending: isToggling } = useToggleAutoRenew();

  const handleUpgrade = () => {
    router.push("/upgrade/checkout");
  };

  const handleToggleAutoRenew = () => {
    toggleAutoRenew();
  };

  if (isPremium) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground">Gói Dịch Vụ Của Bạn</h2>
          <p className="text-sm text-muted-foreground mt-1">Cảm ơn bạn đã đồng hành cùng Smart Wardrobe Premium.</p>
        </div>

        {/* Premium Value Card */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card p-1">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
          
          <div className="relative bg-card/50 backdrop-blur-sm rounded-xl p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 flex-col md:flex-row mb-8">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Crown className="size-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold tracking-tight text-foreground flex items-center gap-2">
                    SMART WARDROBE <span className="text-primary">{user?.subscription?.planName || "PREMIUM"}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Hết hạn vào: {user?.subscription?.expiresAt ? new Date(user?.subscription?.expiresAt).toLocaleDateString("vi-VN") : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6 mt-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Hạn ngạch hôm nay:</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
                  <div className="text-3xl font-heading font-bold text-foreground mb-1">
                    {isLoadingQuota ? "-" : quota?.aiChatDailyQuota ?? "∞"}
                  </div>
                  <div className="text-sm text-muted-foreground leading-snug">Lượt Chat AI tối đa</div>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
                  <div className="text-3xl font-heading font-bold text-foreground mb-1">
                    {isLoadingQuota ? "-" : quota?.aiOutfitDailyQuota ?? "∞"}
                  </div>
                  <div className="text-sm text-muted-foreground leading-snug">Lượt AI tạo Outfit tối đa</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border">
              <Button 
                variant="outline" 
                onClick={handleToggleAutoRenew} 
                disabled={isToggling}
                className="text-foreground border-border flex items-center gap-2"
              >
                <RefreshCw className={`size-4 ${isToggling ? "animate-spin" : ""}`} /> 
                Đổi trạng thái Auto Renew
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div>
        <h2 className="text-xl font-heading font-bold text-foreground">Nâng cấp tài khoản</h2>
        <p className="text-sm text-muted-foreground mt-1">Mở khóa sức mạnh của Stylist AI và tủ đồ không giới hạn.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Free Tier Info */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-heading font-bold text-lg mb-4 text-foreground">Gói hiện tại: {user?.subscription?.planName || "Free Plan"}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><CheckCircle2 className="size-4 text-primary shrink-0" /> Tủ đồ giới hạn {user?.subscription?.maxWardrobeItems ?? 50} items</li>
              <li className="flex gap-2"><CheckCircle2 className="size-4 text-primary shrink-0" /> Số lượt Chat AI: {isLoadingQuota ? "-" : quota?.aiChatDailyQuota} / ngày</li>
              <li className="flex gap-2"><CheckCircle2 className="size-4 text-primary shrink-0" /> Số lượt tạo Outfit: {isLoadingQuota ? "-" : quota?.aiOutfitDailyQuota} / ngày</li>
            </ul>
          </div>
        </div>

        {/* Premium Upsell Card */}
        <div className="relative rounded-2xl p-[1px] overflow-hidden group">
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#B8975A] via-[#D4AF37] to-[#8B7355] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative bg-[#1A1A1A] h-full rounded-2xl p-6 md:p-8 flex flex-col shadow-2xl">
            <div className="absolute top-0 right-0 p-4">
              <Sparkles className="size-6 text-[#D4AF37] opacity-50" />
            </div>
            
            <h3 className="font-heading font-bold text-2xl tracking-tight text-white mb-2">Smart Wardrobe <span className="text-[#D4AF37]">Premium</span></h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold text-white">99k</span>
              <span className="text-zinc-400 text-sm">/tháng</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                "AI Stylist không giới hạn số lượt",
                "Tủ đồ không giới hạn sức chứa",
                "Phân tích DNA Phong cách cá nhân",
                "Báo cáo thống kê giá trị tủ đồ",
                "Miễn phí 100% phí giao dịch chợ đồ cũ",
                "Huy hiệu ✦ Verified Seller danh giá"
              ].map((benefit, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-300 items-start">
                  <ShieldCheck className="size-5 text-[#D4AF37] shrink-0" /> 
                  <span className="leading-snug">{benefit}</span>
                </li>
              ))}
            </ul>

            <Button 
              onClick={handleUpgrade}
              className="w-full bg-[#D4AF37] text-black hover:bg-[#B8975A] font-bold h-12 text-sm rounded-xl flex items-center justify-center gap-2 group/btn transition-all"
            >
              NÂNG CẤP NGAY 
              <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
            <p className="text-center text-xs text-zinc-500 mt-4">Hủy bất cứ lúc nào. Không ràng buộc.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
