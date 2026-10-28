"use client";

import React, { useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Award, Edit2, Gift, Loader2, Plus, Settings, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetBenefits,
  useGetLoyaltyProgram,
  useGetLoyaltyTiers,
} from "@/features/brand-portal/queries/brand-portal.queries";
import { useBrandRole } from "@/features/brand-portal/context/BrandRoleContext";
import { LoyaltyTierRes } from "@/features/brand-portal/types";
import BenefitsClient from "@/app/brand-portal/[brandSlug]/benefits/components/BenefitsClient";
import UpsertLoyaltyProgramDialog from "./UpsertLoyaltyProgramDialog";
import UpsertLoyaltyTierDialog from "./UpsertLoyaltyTierDialog";
import { TierDetailSheet } from "./TierDetailSheet";

export default function LoyaltyClient() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const brandId = params.brandSlug as string;
  const { isStaff } = useBrandRole();

  const tab = searchParams.get("tab") === "benefits" ? "benefits" : "program";
  const tierId = searchParams.get("tierId") || undefined;

  const { data: program, isLoading: isLoadingProgram } = useGetLoyaltyProgram(brandId);
  const { data: tiers, isLoading: isLoadingTiers } = useGetLoyaltyTiers(brandId);
  const { data: activeBenefits } = useGetBenefits(brandId, { page: 1, limit: 1, status: "active" });
  const { data: allBenefits } = useGetBenefits(brandId, { page: 1, limit: 1 });

  const [isUpsertProgramOpen, setIsUpsertProgramOpen] = useState(false);
  const [isUpsertTierOpen, setIsUpsertTierOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<LoyaltyTierRes | undefined>(undefined);

  const updateParams = (updates: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) next.delete(key);
      else next.set(key, value);
    });
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const sortedTiers = tiers ? [...tiers].sort((a, b) => a.rank - b.rank) : [];
  const activeBenefitCount = activeBenefits?.metadata?.totalItems ?? 0;
  const totalBenefitCount = allBenefits?.metadata?.totalItems ?? 0;
  const tierPrivilegeCount = sortedTiers.reduce((sum, tier) => sum + (tier.benefitsCount || 0), 0);
  const isLoading = isLoadingProgram || isLoadingTiers;

  const handleCreateTier = () => {
    setSelectedTier(undefined);
    setIsUpsertTierOpen(true);
  };

  const handleEditTier = (tier: LoyaltyTierRes) => {
    setSelectedTier(tier);
    setIsUpsertTierOpen(true);
  };

  const openTierSheet = (tier: LoyaltyTierRes) => {
    updateParams({ tierId: tier.id, tab: "program" });
  };

  const manageTierBenefits = (targetTierId: string) => {
    updateParams({ tab: "benefits", requiredTierId: targetTierId, tierId: undefined, page: undefined });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Đang tải chương trình điểm...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 p-6 lg:p-8">
      <Tabs value={tab} onValueChange={(value) => updateParams({ tab: value, tierId: undefined })}>
        <TabsList className="w-fit">
          <TabsTrigger value="program">Chương trình & hạng</TabsTrigger>
          <TabsTrigger value="benefits">Quyền lợi & voucher</TabsTrigger>
        </TabsList>

        <TabsContent value="program" className="mt-6 flex flex-col gap-8">
          {!program ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-16 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-muted-foreground opacity-50" />
              </div>
              <h2 className="text-lg font-bold mb-2">Chưa thiết lập chương trình</h2>
              <p className="text-muted-foreground text-sm max-w-md mb-6">
                Thương hiệu của bạn chưa thiết lập chương trình khách hàng thân thiết. Hãy thiết lập để bắt đầu tích điểm cho khách hàng.
              </p>
              {!isStaff && (
                <Button onClick={() => setIsUpsertProgramOpen(true)} className="rounded-xl">
                  <Settings className="w-4 h-4 mr-2" /> Thiết lập chương trình
                </Button>
              )}
            </div>
          ) : (
            <>
              <Card className="rounded-3xl border-border bg-card shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <Award className="w-32 h-32" />
                </div>
                <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="font-bold text-xs uppercase tracking-widest text-primary">Đang hoạt động</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{program.name}</h2>
                    <p className="text-muted-foreground max-w-2xl">
                      Tỉ lệ quy đổi: {(program.amountPerPoint || 10000).toLocaleString("vi-VN")}đ = 1 điểm.
                      {program.pointExpiryDays ? ` Điểm hết hạn sau ${program.pointExpiryDays} ngày.` : " Điểm không có thời hạn."}
                    </p>
                  </div>
                  {!isStaff && (
                    <Button variant="outline" onClick={() => setIsUpsertProgramOpen(true)} className="rounded-xl font-bold text-xs uppercase tracking-widest shrink-0">
                      <Settings className="w-4 h-4 mr-2" /> Cấu hình
                    </Button>
                  )}
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="rounded-2xl border-border bg-card shadow-sm">
                  <CardContent className="p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Hạng thành viên</p>
                    <p className="mt-2 text-2xl font-bold">{sortedTiers.length}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-border bg-card shadow-sm">
                  <CardContent className="p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quyền lợi đang hoạt động</p>
                    <p className="mt-2 text-2xl font-bold">{activeBenefitCount}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Tổng {totalBenefitCount} mục</p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-border bg-card shadow-sm">
                  <CardContent className="p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Gắn theo hạng</p>
                    <p className="mt-2 text-2xl font-bold">{tierPrivilegeCount}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Quyền lợi mở khóa khi đạt hạng</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                    <TrendingUp className="w-5 h-5" /> Các hạng thành viên
                  </h3>
                  {!isStaff && (
                    <Button onClick={handleCreateTier} className="rounded-xl font-bold text-xs uppercase tracking-widest bg-primary text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" /> Thêm hạng mới
                    </Button>
                  )}
                </div>

                {sortedTiers.length === 0 ? (
                  <div className="border border-dashed border-border rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Award className="w-6 h-6 text-muted-foreground opacity-50" />
                    </div>
                    <p className="text-foreground font-bold mb-1">Chưa có hạng thành viên nào</p>
                    <p className="text-muted-foreground text-sm max-w-sm mb-6">
                      Bạn chưa thiết lập bất kỳ hạng thành viên nào cho chương trình. Hãy bắt đầu bằng cách thêm hạng đầu tiên.
                    </p>
                    {!isStaff && (
                      <Button variant="outline" onClick={handleCreateTier} className="rounded-xl">
                        <Plus className="w-4 h-4 mr-2" /> Thêm hạng mới
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {sortedTiers.map((tier, index) => {
                      const colors = [
                        "bg-slate-50 text-slate-900 border-slate-200 dark:bg-slate-900/50 dark:text-slate-100 dark:border-slate-800",
                        "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-100 dark:border-blue-800/50",
                        "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-900/20 dark:text-amber-100 dark:border-amber-800/50",
                        "bg-violet-50 text-violet-900 border-violet-200 dark:bg-violet-900/20 dark:text-violet-100 dark:border-violet-800/50",
                      ];
                      const colorClass = colors[index % colors.length];

                      return (
                        <Card key={tier.id} className={`rounded-3xl border ${colorClass} shadow-sm relative overflow-hidden flex flex-col`}>
                          <CardHeader className="pb-4 relative z-10">
                            <div className="flex justify-between items-start mb-4">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg bg-background/50 border border-border/50">
                                {tier.rank}
                              </div>
                              <div className="flex items-center gap-1">
                                {!isStaff && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-background/20 hover:bg-background/40"
                                    onClick={() => handleEditTier(tier)}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 rounded-full bg-background/20 hover:bg-background/40 font-semibold text-xs"
                                  onClick={() => openTierSheet(tier)}
                                >
                                  Chi tiết
                                </Button>
                              </div>
                            </div>
                            <CardTitle className="text-2xl font-bold tracking-tight">{tier.name}</CardTitle>
                            <CardDescription className="mt-2 flex items-center gap-1.5 text-current/70">
                              <Gift className="size-3.5" /> {tier.benefitsCount || 0} quyền lợi
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="relative z-10 flex-1 flex flex-col justify-between gap-4 pb-6">
                            <div>
                              <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">Chi tiêu tối thiểu</span>
                              <div className="flex items-center gap-2 mt-1">
                                <Wallet className="w-4 h-4 opacity-80" />
                                <span className="font-bold text-lg">
                                  {tier.minTotalSpend > 0 ? `${tier.minTotalSpend.toLocaleString("vi-VN")}đ` : "Mặc định"}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full rounded-full bg-background/40 hover:bg-background/70 text-current font-semibold"
                              onClick={() => manageTierBenefits(tier.id)}
                            >
                              <Gift className="mr-2 size-4" /> Quản lý quyền lợi
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="benefits" className="mt-6">
          <BenefitsClient />
        </TabsContent>
      </Tabs>

      <UpsertLoyaltyProgramDialog
        brandId={brandId}
        open={isUpsertProgramOpen}
        onOpenChange={setIsUpsertProgramOpen}
        program={program}
      />

      <UpsertLoyaltyTierDialog
        brandId={brandId}
        open={isUpsertTierOpen}
        onOpenChange={setIsUpsertTierOpen}
        tier={selectedTier}
      />

      <TierDetailSheet
        brandId={brandId}
        tierId={tierId}
        open={Boolean(tierId)}
        onOpenChange={(open) => {
          if (!open) updateParams({ tierId: undefined });
        }}
        onManageBenefits={manageTierBenefits}
      />
    </div>
  );
}
