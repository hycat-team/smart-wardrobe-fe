"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { useGetLoyaltyProgram, useGetLoyaltyTiers } from '@/features/brand-portal/queries/brand-portal.queries';
import { Award, Loader2, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UpsertLoyaltyProgramDialog from './UpsertLoyaltyProgramDialog';
import { Settings } from 'lucide-react';

export default function LoyaltyClient() {
  const params = useParams();
  const brandId = params.brandId as string;

  const { data: program, isLoading: isLoadingProgram } = useGetLoyaltyProgram(brandId);
  const { data: tiers, isLoading: isLoadingTiers } = useGetLoyaltyTiers(brandId);
  const [isUpsertDialogOpen, setIsUpsertDialogOpen] = React.useState(false);

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
        <Button onClick={() => setIsUpsertDialogOpen(true)} className="rounded-xl">
          <Settings className="w-4 h-4 mr-2" />
          Thiết lập chương trình
        </Button>
        <UpsertLoyaltyProgramDialog
          brandId={brandId}
          open={isUpsertDialogOpen}
          onOpenChange={setIsUpsertDialogOpen}
        />
      </div>
    );
  }

  // Sắp xếp tiers theo điểm yêu cầu
  const sortedTiers = tiers ? [...tiers].sort((a, b) => a.requiredPoints - b.requiredPoints) : [];

  return (
    <div className="w-full flex flex-col gap-8 p-6 lg:p-8">
      {/* Program Summary */}
      <Card className="rounded-3xl border-border bg-card shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Award className="w-32 h-32" />
        </div>
        <CardContent className="p-8 relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-bold text-xs uppercase tracking-widest text-primary">Đang hoạt động</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">{program.name}</h2>
            <p className="text-muted-foreground max-w-2xl">Tỷ lệ quy đổi: {(program.amountPerPoint || 10000).toLocaleString('vi-VN')}đ = 1 điểm. {program.pointExpiryDays ? `Điểm hết hạn sau ${program.pointExpiryDays} ngày.` : 'Điểm không có thời hạn.'}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsUpsertDialogOpen(true)} className="rounded-xl z-20">
            <Settings className="w-4 h-4 mr-2" />
            Cấu hình
          </Button>
        </CardContent>
      </Card>
      
      <UpsertLoyaltyProgramDialog
        brandId={brandId}
        open={isUpsertDialogOpen}
        onOpenChange={setIsUpsertDialogOpen}
        program={program}
      />

      {/* Tiers List */}
      <div>
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Các hạng thành viên
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {sortedTiers.map((tier, index) => {
            const isFirst = index === 0;
            const isHighest = index === sortedTiers.length - 1;
            
            // Generate some colors based on index for variety
            const colors = [
              'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20', // Default
              'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', // Silver
              'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', // Gold
              'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20', // Platinum
            ];
            const colorClass = colors[index % colors.length];

            return (
              <Card key={tier.id} className={`rounded-3xl border ${colorClass.split(' ')[2]} bg-card shadow-sm relative overflow-hidden group`}>
                <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-${colorClass.split('-')[1]}-500/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
                <CardHeader className="pb-4 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colorClass.split(' ').slice(0,2).join(' ')}`}>
                    <Award className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription>
                    {isFirst ? 'Hạng mặc định khi đăng ký' : `Cần đạt ${tier.requiredPoints.toLocaleString('vi-VN')} điểm`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 pt-4 border-t border-border/50">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Tốc độ tích luỹ</span>
                    <div className="flex items-center gap-2">
                      <Zap className={`w-4 h-4 ${colorClass.split(' ')[1]}`} />
                      <span className="font-bold text-lg">x{tier.multiplier} <span className="text-sm font-medium text-muted-foreground">điểm</span></span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
