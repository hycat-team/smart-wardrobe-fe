"use client";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Sparkles, Check, Crown, Star, Infinity, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Upgrade() {
  const router = useRouter();

  return (
    <div className="min-h-full bg-[#0E0E0E] text-[#F5F5F5] p-6 lg:p-12 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto space-y-12 pb-16">
        
        {/* Header Section */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
            <Crown className="size-4" />
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Smart Wardrobe Premium</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading text-primary font-light tracking-wide">
            Định Hình Phong Cách. <br className="hidden md:block" /> Không Giới Hạn.
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Mở khóa toàn bộ tiềm năng tủ đồ của bạn với AI Stylist cao cấp, 
            phân tích Style DNA chuyên sâu và sức chứa không giới hạn.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
          
          {/* Free Plan */}
          <div className="bg-card border border-border rounded-3xl p-8 space-y-6 opacity-80">
            <div className="space-y-2">
              <h3 className="font-heading text-xl">Basic</h3>
              <p className="text-sm text-muted-foreground">Dành cho người mới bắt đầu.</p>
            </div>
            <div className="text-3xl font-heading">
              Miễn phí
            </div>
            <div className="space-y-3 pt-4 border-t border-border">
              {[
                "Lưu trữ tối đa 50 món đồ",
                "3 lượt AI Stylist / ngày",
                "Phối đồ cơ bản",
                "Hỗ trợ cộng đồng"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="size-4 opacity-50" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0E0E0E] border border-primary/50 shadow-2xl shadow-primary/10 rounded-3xl p-8 space-y-6 relative overflow-hidden transform md:scale-105">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="size-24 text-primary" />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(#B8975A_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
            
            <div className="relative z-10 space-y-2">
              <h3 className="font-heading text-2xl text-primary flex items-center gap-2">
                Atelier Premium <Star className="size-5 fill-primary" />
              </h3>
              <p className="text-sm text-muted-foreground">Trải nghiệm thời trang đỉnh cao.</p>
            </div>
            <div className="relative z-10">
              <span className="text-4xl font-heading text-foreground">99.000đ</span>
              <span className="text-muted-foreground text-sm"> /tháng</span>
            </div>
            
            <div className="relative z-10 space-y-4 pt-4 border-t border-primary/20">
              {[
                "Lưu trữ không giới hạn món đồ",
                "AI Stylist không giới hạn & Moodboard",
                "Phân tích Style DNA Radar",
                "Lookbook Editorial cho phối đồ",
                "Gợi ý dọn tủ (Forgotten Items)",
                "Ưu tiên hỗ trợ 24/7"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-foreground">
                  <Check className="size-4 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              onClick={() => router.push("/upgrade/checkout")}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-mono tracking-widest uppercase font-bold relative z-10 shadow-[0_0_20px_rgba(184,151,90,0.3)] transition-all hover:shadow-[0_0_30px_rgba(184,151,90,0.5)]"
            >
              Nâng cấp Atelier
            </Button>
          </div>

        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-border/50 text-center">
          <div className="space-y-2">
            <Infinity className="size-6 mx-auto text-primary" />
            <p className="text-xs font-mono uppercase text-muted-foreground">Không Giới Hạn</p>
          </div>
          <div className="space-y-2">
            <Sparkles className="size-6 mx-auto text-primary" />
            <p className="text-xs font-mono uppercase text-muted-foreground">AI Tiên Tiến</p>
          </div>
          <div className="space-y-2">
            <Shield className="size-6 mx-auto text-primary" />
            <p className="text-xs font-mono uppercase text-muted-foreground">Bảo Mật An Toàn</p>
          </div>
          <div className="space-y-2">
            <Star className="size-6 mx-auto text-primary" />
            <p className="text-xs font-mono uppercase text-muted-foreground">Hủy Bất Kỳ Lúc Nào</p>
          </div>
        </div>

      </div>
    </div>
  );
}


