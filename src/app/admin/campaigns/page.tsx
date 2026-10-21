'use client';

import React, { useState } from 'react';
import { useAdminCampaigns } from '@/features/admin/campaigns/queries/campaign-admin.queries';
import { CampaignDashboardHeader } from '@/features/admin/campaigns/components/CampaignDashboardHeader';
import { CampaignUrgentBanner } from '@/features/admin/campaigns/components/CampaignUrgentBanner';
import { CampaignTable } from '@/features/admin/campaigns/components/CampaignTable';
import { CustomerEligibilityCard } from '@/features/admin/campaigns/components/CustomerEligibilityCard';
import { CreateCampaignModal } from '@/features/admin/campaigns/components/CreateCampaignModal';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminCampaignsPage() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, refetch, isFetching } = useAdminCampaigns({
    page,
    limit,
  });

  const campaigns = data?.items || [];
  const metadata = data?.metadata || { page: 1, limit: 20, totalItems: 0, totalPages: 1 };

  // Đếm số chiến dịch đang hoạt động (running hoặc compensation)
  const activeCount = campaigns.filter(
    (c) => c.status === 'running' || c.status === 'compensation'
  ).length;

  // Lọc các chiến dịch bị lỗi worker nền (degraded: true)
  const degradedCampaigns = campaigns.filter((c) => c.degraded);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Actions */}
      <CampaignDashboardHeader
        totalItems={metadata.totalItems}
        activeCount={activeCount}
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      {/* 2. Cảnh báo khẩn cấp khi cơ chế cấp nền bị lỗi */}
      <CampaignUrgentBanner
        degradedCampaigns={degradedCampaigns}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      {/* 3. Tra cứu điều kiện khách hàng (CS Support Tool) */}
      <CustomerEligibilityCard
        campaigns={campaigns.map((c) => ({
          code: c.code,
          planName: `${c.planName || c.planSlug} (${c.code})`,
        }))}
        defaultCampaignCode={campaigns[0]?.code || ''}
      />

      {/* 4. Bảng danh sách chiến dịch */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Danh sách chiến dịch ({metadata.totalItems})
          </h2>
          {metadata.totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isFetching}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-xs text-muted-foreground font-medium">
                Trang {metadata.page} / {metadata.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
                onClick={() => setPage((p) => Math.min(metadata.totalPages, p + 1))}
                disabled={page >= metadata.totalPages || isFetching}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </div>

        <CampaignTable campaigns={campaigns} isLoading={isLoading} />
      </div>

      {/* 5. Modal Tạo Chiến Dịch Mới */}
      <CreateCampaignModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
