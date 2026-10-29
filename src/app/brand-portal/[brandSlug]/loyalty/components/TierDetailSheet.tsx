"use client";

import { Award, Gift, Loader2, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useGetLoyaltyTierDetails } from "@/features/brand-portal/queries/brand-portal.queries";
import { benefitTypeLabel, unlockTypeLabel } from "@/features/brand-portal/utils/benefit-labels";

interface Props {
  brandId: string;
  tierId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onManageBenefits: (tierId: string) => void;
}

export function TierDetailSheet({ brandId, tierId, open, onOpenChange, onManageBenefits }: Props) {
  const { data: tier, isLoading } = useGetLoyaltyTierDetails(brandId, tierId || "");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[calc(100%-1rem)] sm:max-w-md p-0 gap-0 overflow-hidden">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-border p-6">
            <SheetTitle className="flex items-center gap-2">
              <Award className="size-5 text-primary" />
              {tier?.name || "Chi tiết hạng"}
            </SheetTitle>
            <SheetDescription>
              {tier ? `Hạng ${tier.rank} · Chi tiêu tối thiểu ${tier.minTotalSpend.toLocaleString("vi-VN")}đ` : "Thông tin hạng thành viên"}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="size-7 animate-spin text-muted-foreground" />
              </div>
            ) : !tier ? (
              <p className="text-sm text-muted-foreground">Không tìm thấy hạng thành viên.</p>
            ) : (
              <>
                {tier.description && (
                  <p className="text-sm leading-relaxed text-muted-foreground">{tier.description}</p>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-border bg-muted/30 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Chi tiêu tối thiểu</p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                      <Wallet className="size-4" />
                      {tier.minTotalSpend > 0 ? `${tier.minTotalSpend.toLocaleString("vi-VN")}đ` : "Mặc định"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/30 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quyền lợi</p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                      <Gift className="size-4" />
                      {tier.benefits?.length ?? 0} mục
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    <Sparkles className="size-4 text-amber-500" /> Quyền lợi của hạng
                  </h3>
                  {!tier.benefits || tier.benefits.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                      <p className="text-sm font-semibold">Chưa có quyền lợi</p>
                      <p className="mt-1 text-xs text-muted-foreground">Tạo quyền lợi và gắn vào hạng này để khách hàng nhận được khi đạt hạng.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tier.benefits.map((benefit) => {
                        const isActive = String(benefit.status || "").toLowerCase() === "active";
                        return (
                          <div key={benefit.id} className="rounded-2xl border border-border bg-background p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold">{benefit.name}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {benefitTypeLabel(benefit.benefitType)} · {unlockTypeLabel(benefit.unlockType)}
                                </p>
                              </div>
                              <span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-widest ${
                                isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                              }`}>
                                {isActive ? "Active" : benefit.status}
                              </span>
                            </div>
                            {benefit.description && (
                              <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">{benefit.description}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {tier && (
            <div className="border-t border-border p-4">
              <Button className="w-full rounded-full" onClick={() => onManageBenefits(tier.id)}>
                <Gift className="mr-2 size-4" /> Quản lý quyền lợi của hạng
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
