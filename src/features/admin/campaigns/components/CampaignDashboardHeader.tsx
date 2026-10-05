import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Gift, RefreshCw } from 'lucide-react';

interface CampaignDashboardHeaderProps {
  totalItems: number;
  activeCount: number;
  onOpenCreateModal: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function CampaignDashboardHeader({
  totalItems,
  activeCount,
  onOpenCreateModal,
  onRefresh,
  isRefreshing,
}: CampaignDashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Gift className="size-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Chiến dịch Tặng gói
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Quản lý các chương trình khuyến mãi cấp gói cước cho tài khoản mới ({totalItems} chiến dịch, {activeCount} đang hoạt động)
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="gap-1.5"
        >
          <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>

        <Button size="sm" onClick={onOpenCreateModal} className="gap-1.5 shadow-xs">
          <Plus className="size-4" />
          Mở chiến dịch mới
        </Button>
      </div>
    </div>
  );
}
