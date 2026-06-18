"use client";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { Settings, Crown, TrendingUp, Leaf, Award, Sparkles, Wallet, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletPageContent } from "@/features/wallet/components/WalletPageContent";
import { UserRes } from "@/features/profile/types";
import { useProfile } from "@/features/profile/queries/profile.queries";
import { getUserAvatar } from "@/lib/utils";
import { useEffect } from "react";

export function ProfileClient({ initialProfile }: { initialProfile: UserRes }) {
  // Pass initialProfile to useProfile so React Query hydrates it immediately
  const { data: profile } = useProfile(initialProfile);

  const isPremium = (!!profile?.subscription?.planSlug && profile.subscription.planSlug !== "free") ||
    (!!(profile as any)?.planSlug && (profile as any)?.planSlug !== "free");

  // Format avatar and name to display
  const avatar = getUserAvatar(profile);
  const name = profile?.firstName + (profile?.lastName ? ` ${profile.lastName}` : "");

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500 pb-16 pt-8 font-sans px-4">

      {/* Profile Header */}
      <div className={cn(
        "rounded-3xl p-8 border relative overflow-hidden flex flex-col md:flex-row items-center gap-8",
        isPremium ? "bg-card border-border shadow-md" : "bg-cream-dark/15 border-cream-dark/60"
      )}>
        {isPremium && (
          <div className="absolute inset-0 bg-[radial-gradient(#B8975A_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        )}

        <div className="relative z-10 size-32 rounded-full border-4 border-background overflow-hidden shrink-0 shadow-lg">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
          {isPremium && (
            <div className="absolute bottom-0 inset-x-0 bg-primary/90 text-primary-foreground text-[10px] font-bold text-center py-0.5 uppercase tracking-widest backdrop-blur-sm">
              Atelier
            </div>
          )}
        </div>

        <div className="relative z-10 flex-1 text-center md:text-left space-y-3">
          <div>
            <h1 className={cn("text-3xl font-heading font-medium tracking-wide text-ink")}>
              {name}
            </h1>
            <p className="text-sm font-mono text-muted-foreground mt-1">{profile?.email}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-xs font-medium">
              <Award className="size-4 text-terracotta" /> 12 Outfit
            </div>
            {isPremium ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
                <Crown className="size-4" /> Premium
              </div>
            ) : (
              <Link href="/pricing" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-dark/50 hover:bg-terracotta/10 hover:text-terracotta border border-transparent transition-colors text-xs font-medium text-ink-muted">
                Nâng cấp Premium
              </Link>
            )}
          </div>
        </div>

        <div className="relative z-10 flex md:flex-col gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none h-10 px-6 bg-ink text-cream hover:bg-ink/90 rounded-xl text-xs font-mono font-medium transition-all">
            <Link href="/profile/update"> Chỉnh sửa</Link>
          </button>
          <button className="flex-1 md:flex-none h-10 px-6 bg-secondary text-foreground hover:bg-secondary/80 rounded-xl text-xs font-mono font-medium border border-border transition-all flex items-center justify-center gap-2">
            <Settings className="size-4" /> Cài đặt
          </button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8 bg-cream-dark/15 border border-cream-dark/60 rounded-xl p-1 h-12 mx-auto md:mx-0">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-ink data-[state=active]:text-cream text-ink-muted">
            <LayoutDashboard className="size-4 mr-2" /> Tổng quan
          </TabsTrigger>
          <TabsTrigger value="wallet" className="rounded-lg data-[state=active]:bg-ink data-[state=active]:text-cream text-ink-muted">
            <Wallet className="size-4 mr-2" /> Ví thanh toán
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="animate-in fade-in duration-500">
          {/* Premium Only: Style DNA & Insights */}
          {isPremium ? (
            <div className="grid md:grid-cols-2 gap-6">

              {/* Radar Chart: Style DNA */}
              <div className="bg-card border border-border rounded-3xl p-6 relative overflow-hidden flex flex-col items-center">
                <div className="w-full flex justify-between items-start mb-6 z-10">
                  <div>
                    <h3 className="font-heading text-lg text-foreground font-bold flex items-center gap-2">Style DNA <Sparkles className="size-4 text-primary" /></h3>
                    <p className="text-xs text-muted-foreground mt-1">Dựa trên 45 trang phục gần nhất</p>
                  </div>
                  <span className="text-4xl font-heading text-primary font-light">9.2</span>
                </div>

                <div className="relative size-64 z-10 mt-2 mb-6">
                  {/* Radar Chart Mockup */}
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(184,151,90,0.15)]">
                    {/* Background grids */}
                    <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border/50" />
                    <polygon points="50,30 70,40 70,60 50,70 30,60 30,40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border/50" />
                    <polygon points="50,40 60,45 60,55 50,60 40,55 40,45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border/50" />

                    {/* Axes */}
                    <line x1="50" y1="50" x2="50" y2="10" stroke="currentColor" strokeWidth="0.5" className="text-border/50" />
                    <line x1="50" y1="50" x2="90" y2="30" stroke="currentColor" strokeWidth="0.5" className="text-border/50" />
                    <line x1="50" y1="50" x2="90" y2="70" stroke="currentColor" strokeWidth="0.5" className="text-border/50" />
                    <line x1="50" y1="50" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" className="text-border/50" />
                    <line x1="50" y1="50" x2="10" y2="70" stroke="currentColor" strokeWidth="0.5" className="text-border/50" />
                    <line x1="50" y1="50" x2="10" y2="30" stroke="currentColor" strokeWidth="0.5" className="text-border/50" />

                    {/* Data Polygon */}
                    <polygon points="50,15 80,35 75,65 50,85 20,60 15,35" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" className="text-primary transition-all duration-1000 ease-in-out" />

                    {/* Labels */}
                    <text x="50" y="6" fontSize="4" textAnchor="middle" fill="currentColor" className="text-muted-foreground font-mono font-bold">Minimalist</text>
                    <text x="94" y="31" fontSize="4" textAnchor="start" fill="currentColor" className="text-muted-foreground font-mono font-bold">Elegant</text>
                    <text x="94" y="72" fontSize="4" textAnchor="start" fill="currentColor" className="text-muted-foreground font-mono font-bold">Edgy</text>
                    <text x="50" y="96" fontSize="4" textAnchor="middle" fill="currentColor" className="text-muted-foreground font-mono font-bold">Casual</text>
                    <text x="6" y="72" fontSize="4" textAnchor="end" fill="currentColor" className="text-muted-foreground font-mono font-bold">Sporty</text>
                    <text x="6" y="31" fontSize="4" textAnchor="end" fill="currentColor" className="text-muted-foreground font-mono font-bold">Vintage</text>
                  </svg>
                </div>

                <p className="text-xs font-mono uppercase tracking-widest text-primary/80 z-10 text-center">
                  Khám phá thêm về bản sắc của bạn
                </p>
              </div>

              {/* Sustainability & Stats */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-3xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <Leaf className="size-32 text-green-500" />
                  </div>

                  <div className="flex items-start gap-4 relative z-10">
                    <div className="size-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                      <Leaf className="size-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold">Sustainability Index</h3>
                      <p className="text-sm text-muted-foreground mt-1">Đánh giá mức độ thời trang bền vững dựa trên tần suất mặc và tuổi thọ đồ.</p>

                      <div className="mt-4 flex items-center gap-4 text-xs font-mono">
                        <span className="text-green-500 font-bold text-lg">B+</span>
                        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 w-[78%]" />
                        </div>
                        <span>78%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-6 flex flex-col justify-center min-h-[160px]">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <TrendingUp className="size-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold">Màu sắc thịnh hành</h3>
                      <p className="text-sm text-muted-foreground mt-1">Tháng này, bạn có xu hướng ưu tiên tông màu ấm.</p>

                      <div className="mt-4 flex gap-2">
                        <div className="size-6 rounded-full bg-[#1A1A1A] border shadow-sm" title="Black (35%)" />
                        <div className="size-6 rounded-full bg-[#B8975A] border shadow-sm" title="Gold (25%)" />
                        <div className="size-6 rounded-full bg-[#F5F5DC] border shadow-sm" title="Beige (20%)" />
                        <div className="size-6 rounded-full bg-[#9CA3AF] border shadow-sm" title="Gray (10%)" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 opacity-60 grayscale-[0.8] hover:grayscale-0 transition-all cursor-not-allowed">
              <div className="bg-cream-dark/15 border border-cream-dark/60 rounded-3xl p-6 text-center space-y-4 flex flex-col items-center justify-center min-h-[300px]">
                <Crown className="size-10 text-ink-muted" />
                <div>
                  <h3 className="font-heading text-lg font-bold text-ink">Style DNA Radar</h3>
                  <p className="text-sm text-ink-muted mt-2">Nâng cấp Premium để xem phân tích bản sắc phong cách chuyên sâu dựa trên AI.</p>
                </div>
              </div>
              <div className="bg-cream-dark/15 border border-cream-dark/60 rounded-3xl p-6 text-center space-y-4 flex flex-col items-center justify-center min-h-[300px]">
                <Leaf className="size-10 text-ink-muted" />
                <div>
                  <h3 className="font-heading text-lg font-bold text-ink">Sustainability Index</h3>
                  <p className="text-sm text-ink-muted mt-2">Theo dõi chỉ số bền vững của tủ đồ và tối ưu hóa vòng đời trang phục với Atelier Premium.</p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="wallet" className="animate-in fade-in duration-500 mt-2">
          <WalletPageContent />
        </TabsContent>
      </Tabs>

    </div>
  );
}
