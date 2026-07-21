"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetLoyaltyProgram, useGetLoyaltyTiers } from '@/features/brand-portal/queries/brand-portal.queries';
import { Award, Loader2, Sparkles, TrendingUp, Settings, Plus, Edit2, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UpsertLoyaltyProgramDialog from './UpsertLoyaltyProgramDialog';
import UpsertLoyaltyTierDialog from './UpsertLoyaltyTierDialog';
import { LoyaltyTierRes } from '@/features/brand-portal/types';

export default function LoyaltyClient() {
  const params = useParams();
  const brandId = params.brandId as string;

  const { data: program, isLoading: isLoadingProgram } = useGetLoyaltyProgram(brandId);
  const { data: tiers, isLoading: isLoadingTiers } = useGetLoyaltyTiers(brandId);
  
  const [isUpsertProgramOpen, setIsUpsertProgramOpen] = useState(false);
  
  const [isUpsertTierOpen, setIsUpsertTierOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<LoyaltyTierRes | undefined>(undefined);

  const isLoading = isLoadingProgram || isLoadingTiers;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Đang tải cấu hình chương trình điểm...</p>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Award className="w-8 h-8 text-muted-foreground opacity-50" />
        </div>
        <h2 className="text-lg font-bold mb-2">Chưa thiết lập chương trình</h2>
        <p className="text-muted-foreground text-sm max-w-md mb-6">
          Thương hiệu của bạn chưa thiết lập chương trình khách hàng thân thiết. Vui lòng thiết lập để bắt đầu tích điểm cho khách hàng.
        </p>
        <Button onClick={() => setIsUpsertProgramOpen(true)} className="rounded-xl">
          <Settings className="w-4 h-4 mr-2" />
          Thiết lập chương trình
        </Button>
        <UpsertLoyaltyProgramDialog
          brandId={brandId}
          open={isUpsertProgramOpen}
          onOpenChange={setIsUpsertProgramOpen}
        />
      </div>
    );
  }

  // Sort tiers by rank
  const sortedTiers = tiers ? [...tiers].sort((a, b) => a.rank - b.rank) : [];

  const handleCreateTier = () => {
    setSelectedTier(undefined);
    setIsUpsertTierOpen(true);
  };

  const handleEditTier = (tier: LoyaltyTierRes) => {
    setSelectedTier(tier);
    setIsUpsertTierOpen(true);
  };

  return (
    <div className="w-full flex flex-col gap-10 p-6 lg:p-8">
      {/* Program Summary */}
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
              Tỷ lệ quy đổi: {(program.amountPerPoint || 10000).toLocaleString('vi-VN')}đ = 1 điểm. 
              {program.pointExpiryDays ? ` Điểm hết hạn sau ${program.pointExpiryDays} ngày.` : ' Điểm không có thời hạn.'}
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsUpsertProgramOpen(true)} className="rounded-xl font-bold text-xs uppercase tracking-widest shrink-0">
            <Settings className="w-4 h-4 mr-2" />
            Cấu hình
          </Button>
        </CardContent>
      </Card>
      
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

      {/* Tiers List */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
            <TrendingUp className="w-5 h-5" />
            Các hạng thành viên
          </h3>
          <Button onClick={handleCreateTier} className="rounded-xl font-bold text-xs uppercase tracking-widest bg-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Thêm hạng mới
          </Button>
        </div>

        {sortedTiers.length === 0 ? (
          <div className="border border-dashed border-border rounded-3xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-muted-foreground opacity-50" />
            </div>
            <p className="text-foreground font-bold mb-1">Chưa có hạng thành viên nào</p>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">Bạn chưa thiết lập bất kỳ hạng thành viên nào cho chương trình. Hãy bắt đầu bằng cách thêm hạng đầu tiên.</p>
            <Button variant="outline" onClick={handleCreateTier} className="rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Thêm hạng mới
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {sortedTiers.map((tier, index) => {
              // Color system based on rank index
              const colors = [
                'bg-slate-50 text-slate-900 border-slate-200 dark:bg-slate-900/50 dark:text-slate-100 dark:border-slate-800', // Rank 1: Basic
                'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-100 dark:border-blue-800/50', // Rank 2: Silver/Blue
                'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-900/20 dark:text-amber-100 dark:border-amber-800/50', // Rank 3: Gold
                'bg-violet-50 text-violet-900 border-violet-200 dark:bg-violet-900/20 dark:text-violet-100 dark:border-violet-800/50', // Rank 4: Platinum
              ];
              const colorClass = colors[index % colors.length];

              return (
                <Card key={tier.id} className={`rounded-3xl border ${colorClass} shadow-sm relative overflow-hidden flex flex-col`}>
                  <CardHeader className="pb-4 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg bg-background/50 border border-border/50`}>
                        {tier.rank}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-background/20 hover:bg-background/40"
                        onClick={() => handleEditTier(tier)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">{tier.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 flex-1 flex flex-col justify-end pb-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">Chi tiêu tối thiểu</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Wallet className="w-4 h-4 opacity-80" />
                          <span className="font-bold text-lg">
                            {tier.minTotalSpend > 0 ? `${tier.minTotalSpend.toLocaleString('vi-VN')} đ` : 'Mặc định'}
                          </span>
                        </div>
                      </div>
                      
                      {tier.description && (
                        <div>
                          <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">Đặc quyền</span>
                          <p className="text-sm mt-1 opacity-90 line-clamp-3 leading-relaxed">
                            {tier.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
