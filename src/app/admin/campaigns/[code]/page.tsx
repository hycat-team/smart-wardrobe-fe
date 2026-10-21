'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAdminCampaignDetail } from '@/features/admin/campaigns/queries/campaign-admin.queries';
import { CampaignStatusBadge } from '@/features/admin/campaigns/components/CampaignStatusBadge';
import { CampaignOverviewTab } from '@/features/admin/campaigns/components/CampaignOverviewTab';
import { CampaignClaimsTab } from '@/features/admin/campaigns/components/CampaignClaimsTab';
import { CampaignAuditTab } from '@/features/admin/campaigns/components/CampaignAuditTab';
import { EditCampaignModal } from '@/features/admin/campaigns/components/EditCampaignModal';
import { CloseCampaignDialog } from '@/features/admin/campaigns/components/CloseCampaignDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Edit,
  PowerOff,
  RefreshCw,
  Lock,
  AlertTriangle,
  Layers,
  Users,
  History,
} from 'lucide-react';

interface CampaignDetailPageProps {
  params: Promise<{ code: string }>;
}

export default function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const resolvedParams = use(params);
  const code = decodeURIComponent(resolvedParams.code);

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCloseOpen, setIsCloseOpen] = useState(false);

  const { data: campaign, isLoading, isError, error, refetch, isFetching } = useAdminCampaignDetail(code);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <div className="inline-block size-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
        <p className="text-sm text-muted-foreground">Đang tải thông tin chi tiết chiến dịch...</p>
      </div>
    );
  }

  if (isError || !campaign) {
    let errorMsg = `Không tìm thấy chiến dịch với mã: "${code}".`;
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMsg = error.response.data.message;
    }
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="size-12 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="size-6" />
        </div>
        <h2 className="text-xl font-bold">Không tìm thấy chiến dịch</h2>
        <p className="text-sm text-muted-foreground">{errorMsg}</p>
        <div>
          <Link href="/admin/campaigns" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Quay lại danh sách chiến dịch
          </Link>
        </div>
      </div>
    );
  }

  const isClosed = campaign.status === 'closed';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Thanh điều hướng quay lại & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/campaigns"
            className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'h-8 px-2 text-muted-foreground' })}
          >
            <ArrowLeft className="size-4 mr-1" />
            Danh sách
          </Link>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
              {campaign.code}
            </h1>
            <CampaignStatusBadge status={campaign.status} closedAt={campaign.closedAt} />
            {campaign.budgetLocked && (
              <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-700 border-amber-500/20 gap-1">
                <Lock className="size-3" />
                Đã khóa ngân sách
              </Badge>
            )}
          </div>
        </div>

        {/* Nút thao tác Quản trị */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 gap-1.5 text-xs"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            className="h-8 gap-1.5 text-xs"
          >
            <Edit className="size-3.5" />
            Sửa chiến dịch
          </Button>

          {!isClosed && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsCloseOpen(true)}
              className="h-8 gap-1.5 text-xs shadow-xs"
            >
              <PowerOff className="size-3.5" />
              Đóng chiến dịch
            </Button>
          )}
        </div>
      </div>

      {/* 2. Cảnh báo lỗi suy giảm cơ chế cấp nền */}
      {campaign.degraded && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-800 dark:text-red-200 flex items-start gap-3">
          <AlertTriangle className="size-5 text-red-600 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <h4 className="font-semibold text-red-700 dark:text-red-300">
              Cảnh báo: Worker cấp gói nền đang bị suy giảm (degraded: true)
            </h4>
            <p className="mt-0.5 opacity-90 leading-relaxed">
              {campaign.degradedReason || 'Hệ thống nền không thể tự động cấp gói. Vui lòng kiểm tra lại hạ tầng worker.'}
            </p>
          </div>
        </div>
      )}

      {/* 3. Hệ thống Tab Nội dung */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/60 p-1 border border-border">
          <TabsTrigger value="overview" className="text-xs gap-1.5 px-3 py-1.5">
            <Layers className="size-3.5" />
            Tổng quan & Ngân sách
          </TabsTrigger>
          <TabsTrigger value="claims" className="text-xs gap-1.5 px-3 py-1.5">
            <Users className="size-3.5" />
            Lượt cấp gói ({campaign.grantedTotalCount})
          </TabsTrigger>
          <TabsTrigger value="audit" className="text-xs gap-1.5 px-3 py-1.5">
            <History className="size-3.5" />
            Nhật ký kiểm toán
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <CampaignOverviewTab campaign={campaign} />
        </TabsContent>

        <TabsContent value="claims" className="space-y-4">
          <CampaignClaimsTab campaignCode={campaign.code} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <CampaignAuditTab campaignCode={campaign.code} />
        </TabsContent>
      </Tabs>

      {/* 4. Modals Sửa & Đóng */}
      <EditCampaignModal
        campaign={campaign}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <CloseCampaignDialog
        campaignCode={campaign.code}
        version={campaign.version}
        isOpen={isCloseOpen}
        onClose={() => setIsCloseOpen(false)}
      />
    </div>
  );
}
