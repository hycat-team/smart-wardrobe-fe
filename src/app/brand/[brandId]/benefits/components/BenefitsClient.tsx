"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetBenefits, useUpdateBenefitStatus } from '@/features/brand-portal/queries/brand-portal.queries';
import { Gift, Loader2, Plus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import CreateBenefitDialog from './CreateBenefitDialog';

export default function BenefitsClient() {
  const params = useParams();
  const brandId = params.brandId as string;

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: benefits, isLoading } = useGetBenefits(brandId);
  const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateBenefitStatus(brandId);

  const handleToggleStatus = async (benefitId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';
    try {
      await updateStatus({ benefitId, status: newStatus });
    } catch (error) {
      console.error(error);
    }
  };

  const getBenefitIcon = (type: string) => {
    switch (type) {
      case 'POINT_REDEMPTION': return <Tag className="w-5 h-5 text-amber-500" />;
      case 'TIER_PRIVILEGE': return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case 'FEATURE_ACCESS': return <Gift className="w-5 h-5 text-blue-500" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  const getBenefitTypeName = (type: string) => {
    switch (type) {
      case 'POINT_REDEMPTION': return 'Đổi điểm lấy quà';
      case 'TIER_PRIVILEGE': return 'Đặc quyền theo hạng';
      case 'FEATURE_ACCESS': return 'Quyền truy cập tính năng';
      default: return type;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex justify-between items-center bg-card p-4 rounded-3xl border border-border shadow-sm">
        <div className="flex flex-col">
          <span className="font-bold">Danh sách phúc lợi</span>
          <span className="text-xs text-muted-foreground">{benefits?.length || 0} phúc lợi đã được tạo</span>
        </div>
        <Button className="rounded-full" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Tạo phúc lợi mới
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : !benefits || benefits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Gift className="w-16 h-16 text-muted-foreground opacity-20 mb-4" />
          <h2 className="text-lg font-bold mb-2">Chưa có phúc lợi nào</h2>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            Hãy tạo các phúc lợi như đổi điểm lấy voucher hoặc đặc quyền cho hạng VIP.
          </p>
          <Button variant="outline" className="rounded-full" onClick={() => setIsCreateDialogOpen(true)}>
            Tạo ngay
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <Card key={benefit.id} className="rounded-3xl border-border bg-card shadow-sm hover:border-primary/50 transition-colors group overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      {getBenefitIcon(benefit.benefitType)}
                    </div>
                    <Badge variant="outline" className={`rounded-full font-bold uppercase tracking-widest text-[9px] ${
                      benefit.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                      benefit.status === 'ARCHIVED' ? 'bg-muted text-muted-foreground border-transparent' : 
                      'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}>
                      {benefit.status}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{benefit.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] mb-4">
                    {benefit.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary" className="rounded-md font-medium text-xs bg-muted/50">
                      {getBenefitTypeName(benefit.benefitType)}
                    </Badge>
                    {benefit.requiredPoints ? (
                      <Badge variant="outline" className="rounded-md font-medium text-xs border-amber-500/30 text-amber-600">
                        {benefit.requiredPoints.toLocaleString('vi-VN')} điểm
                      </Badge>
                    ) : null}
                    {benefit.requiredTierId ? (
                      <Badge variant="outline" className="rounded-md font-medium text-xs border-primary/30 text-primary">
                        Tier ID: {benefit.requiredTierId}
                      </Badge>
                    ) : null}
                  </div>
                </div>
                
                <div className="p-4 bg-muted/20 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Trạng thái hoạt động</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium">{benefit.status === 'ACTIVE' ? 'Bật' : 'Tắt'}</span>
                    <Switch 
                      checked={benefit.status === 'ACTIVE'}
                      disabled={isUpdating || benefit.status === 'DRAFT'}
                      onCheckedChange={() => handleToggleStatus(benefit.id, benefit.status)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateBenefitDialog 
        brandId={brandId}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
