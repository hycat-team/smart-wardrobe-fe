"use client";

import React, { useMemo, useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Gift, Loader2, Plus, ShieldCheck, Ticket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateBenefitDialog from "./CreateBenefitDialog";
import { useGetBenefits, useGetLoyaltyTiers, useUpdateBenefitStatus } from "@/features/brand-portal/queries/brand-portal.queries";
import { benefitTypeLabel, isVoucherBenefitType, unlockTypeLabel } from "@/features/brand-portal/utils/benefit-labels";

const PAGE_LIMIT = 9;

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Tạm tắt" },
  { value: "archived", label: "Lưu trữ" },
];

const UNLOCK_OPTIONS = [
  { value: "all", label: "Mọi hình thức" },
  { value: "point_redemption", label: "Đổi bằng điểm" },
  { value: "tier_privilege", label: "Theo hạng thành viên" },
  { value: "manual_grant", label: "Tặng thủ công" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "Mọi loại" },
  { value: "voucher", label: "Voucher" },
  { value: "feature_access", label: "Quyền lợi tính năng" },
];

export default function BenefitsClient() {
  const params = useParams();
  const brandId = params.brandSlug as string;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const status = searchParams.get("status") || "";
  const unlockType = searchParams.get("unlockType") || "";
  const benefitType = searchParams.get("benefitType") || "";
  const requiredTierId = searchParams.get("requiredTierId") || "";
  const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);

  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,
      ...(status ? { status } : {}),
      ...(unlockType ? { unlockType } : {}),
      ...(benefitType ? { benefitType } : {}),
      ...(requiredTierId ? { requiredTierId } : {}),
    }),
    [page, status, unlockType, benefitType, requiredTierId],
  );

  const { data: tiers } = useGetLoyaltyTiers(brandId);
  const { data: benefitsData, isLoading } = useGetBenefits(brandId, queryParams);
  const benefits = benefitsData?.items || [];
  const metadata = benefitsData?.metadata;
  const totalItems = metadata?.totalItems ?? benefits.length;
  const totalPages = metadata?.totalPages ?? Math.max(1, Math.ceil(totalItems / PAGE_LIMIT));
  const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateBenefitStatus(brandId);

  const updateParams = (updates: Record<string, string | undefined>, resetPage = true) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") next.delete(key);
      else next.set(key, value);
    });
    if (resetPage) next.set("page", "1");
    next.set("tab", "benefits");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const hasFilters = Boolean(status || unlockType || benefitType || requiredTierId);

  const handleToggleStatus = async (benefitId: string, currentStatus: string) => {
    const isCurrentlyActive = currentStatus.toLowerCase() === "active";
    const newStatus = isCurrentlyActive ? "archived" : "active";
    try {
      await updateStatus({ benefitId, status: newStatus });
    } catch (error) {
      console.error(error);
    }
  };

  const getBenefitIcon = (type: string) =>
    isVoucherBenefitType(type) ? (
      <Ticket className="w-5 h-5 text-amber-500" />
    ) : (
      <ShieldCheck className="w-5 h-5 text-rose-500" />
    );

  const getFeatureCodeName = (code?: string) => {
    if (!code) return null;
    if (code === "sample_mix_access") return "Digital Sample Lab";
    return code;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-4 bg-card p-4 rounded-3xl border border-border shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="font-bold">Danh sách quyền lợi & voucher</span>
            <span className="text-xs text-muted-foreground">{totalItems} mục đã được tạo</span>
          </div>
          <div className="flex items-center gap-2">
            {hasFilters && (
              <Button
                variant="ghost"
                className="rounded-full text-xs"
                onClick={() => updateParams({ status: undefined, unlockType: undefined, benefitType: undefined, requiredTierId: undefined })}
              >
                <X className="mr-1 size-3.5" /> Xóa lọc
              </Button>
            )}
            <Button className="rounded-full" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Tạo quyền lợi / voucher
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select value={status || "all"} onValueChange={(value) => updateParams({ status: value ?? undefined })}>
            <SelectTrigger aria-label="Lọc theo trạng thái" className="w-full rounded-xl">
              <SelectValue>{(value) => STATUS_OPTIONS.find((option) => option.value === (value || "all"))?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={unlockType || "all"} onValueChange={(value) => updateParams({ unlockType: value ?? undefined })}>
            <SelectTrigger aria-label="Lọc theo hình thức mở khóa" className="w-full rounded-xl">
              <SelectValue>{(value) => UNLOCK_OPTIONS.find((option) => option.value === (value || "all"))?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {UNLOCK_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={benefitType || "all"} onValueChange={(value) => updateParams({ benefitType: value ?? undefined })}>
            <SelectTrigger aria-label="Lọc theo loại quyền lợi" className="w-full rounded-xl">
              <SelectValue>{(value) => TYPE_OPTIONS.find((option) => option.value === (value || "all"))?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={requiredTierId || "all"} onValueChange={(value) => updateParams({ requiredTierId: value ?? undefined })}>
            <SelectTrigger aria-label="Lọc theo hạng thành viên" className="w-full rounded-xl">
              <SelectValue>
                {(value) =>
                  !value || value === "all"
                    ? "Mọi hạng thành viên"
                    : tiers?.find((tier) => tier.id === value)?.name || "Mọi hạng thành viên"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Mọi hạng thành viên</SelectItem>
              {(tiers ?? []).map((tier) => (
                <SelectItem key={tier.id} value={tier.id}>{tier.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : benefits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Gift className="w-16 h-16 text-muted-foreground opacity-20 mb-4" />
          <h2 className="text-lg font-bold mb-2">
            {hasFilters ? "Không có quyền lợi phù hợp" : "Chưa có quyền lợi/voucher nào"}
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            {hasFilters
              ? "Thử bỏ bớt bộ lọc hoặc tạo quyền lợi mới cho hạng đang chọn."
              : "Hãy tạo voucher đổi bằng điểm hoặc quyền lợi tự động theo hạng thành viên."}
          </p>
          <Button variant="outline" className="rounded-full" onClick={() => setIsCreateDialogOpen(true)}>
            Tạo ngay
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {benefits.map((benefit) => {
            const isActive = benefit.status.toLowerCase() === "active";
            const isArchived = benefit.status.toLowerCase() === "archived";

            return (
              <Card key={benefit.id} className="rounded-3xl border-border bg-card shadow-sm hover:border-primary/50 transition-colors group overflow-hidden flex flex-col">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        {getBenefitIcon(benefit.benefitType)}
                      </div>
                      <Badge variant="outline" className={`rounded-full font-bold uppercase tracking-widest text-[9px] ${
                        isActive ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                        isArchived ? "bg-muted text-muted-foreground border-transparent" :
                        "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      }`}>
                        {benefit.status}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{benefit.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] mb-4">
                      {benefit.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="secondary" className="rounded-md font-medium text-xs bg-muted/50">
                        {benefitTypeLabel(benefit.benefitType)}
                      </Badge>
                      <Badge variant="outline" className="rounded-md font-medium text-xs">
                        {unlockTypeLabel(benefit.unlockType)}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {benefit.unlockType?.toLowerCase() === "point_redemption" && benefit.requiredPoints ? (
                        <Badge variant="outline" className="rounded-md font-medium text-xs border-amber-500/30 text-amber-600">
                          {benefit.requiredPoints.toLocaleString("vi-VN")} điểm
                        </Badge>
                      ) : null}
                      {benefit.unlockType?.toLowerCase() === "tier_privilege" && benefit.requiredTierId ? (
                        <Badge variant="outline" className="rounded-md font-medium text-xs border-primary/30 text-primary">
                          Hạng: {benefit.requiredTierName}{benefit.requiredTierRank ? ` (rank ${benefit.requiredTierRank})` : ""}
                        </Badge>
                      ) : null}
                      {benefit.benefitType?.toLowerCase() === "feature_access" && benefit.featureCode ? (
                        <Badge variant="outline" className="rounded-md font-medium text-xs border-indigo-500/30 text-indigo-600">
                          {getFeatureCodeName(benefit.featureCode)}
                        </Badge>
                      ) : null}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/20 border-t border-border flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Trạng thái hoạt động</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium">{isActive ? "Bật" : "Tắt"}</span>
                      <Switch
                        checked={isActive}
                        disabled={isUpdating || benefit.status.toLowerCase() === "draft"}
                        onCheckedChange={() => handleToggleStatus(benefit.id, benefit.status)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-3">
          <span className="text-xs text-muted-foreground">
            Trang {page}/{totalPages}
          </span>
          <Button
            variant="outline"
            className="rounded-full"
            disabled={page <= 1}
            onClick={() => updateParams({ page: String(page - 1) }, false)}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            disabled={page >= totalPages}
            onClick={() => updateParams({ page: String(page + 1) }, false)}
          >
            Sau
          </Button>
        </div>
      )}

      <CreateBenefitDialog
        brandId={brandId}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        defaultTierId={requiredTierId || undefined}
        defaultUnlockType={unlockType || undefined}
      />
    </div>
  );
}
