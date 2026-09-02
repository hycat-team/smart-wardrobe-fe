'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGetLoyaltyTierDetails } from '@/features/brand-portal/queries/brand-portal.queries';
import { Loader2, ArrowLeft, Award, Gift, Wallet, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StaffTierDetailsClient({ brandId, tierId }: { brandId: string, tierId: string }) {
  const router = useRouter();
  const { data: tier, isLoading } = useGetLoyaltyTierDetails(brandId, tierId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Đang tải thông tin hạng...</p>
      </div>
    );
  }

  if (!tier) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-destructive">
        <p>Không tìm thấy hạng thành viên.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>Quay lại</Button>
      </div>
    );
  }

  const benefits = tier.benefits || [];

  return (
    <div className="w-full flex flex-col gap-6 p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Hạng: {tier.name}
          </h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-muted text-xs font-bold">{tier.rank}</span>
            <span>Chi tiêu tối thiểu: {tier.minTotalSpend.toLocaleString('vi-VN')}đ</span>
          </p>
        </div>
      </div>

      <Card className="rounded-3xl border-border bg-card shadow-sm mt-4">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Quyền lợi của hạng
          </CardTitle>
        </CardHeader>
        <CardContent>
          {benefits.length === 0 ? (
            <div className="border border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <Gift className="w-12 h-12 text-muted-foreground opacity-30 mb-4" />
              <p className="text-foreground font-bold mb-1">Chưa có quyền lợi</p>
              <p className="text-muted-foreground text-sm max-w-sm mb-6">
                Hạng này chưa được cấu hình bất kỳ quyền lợi nào. Hãy sang mục "Phúc Lợi" để thêm quyền lợi và gắn vào hạng này.
              </p>
              <Button variant="outline" className="rounded-xl" onClick={() => router.push(`/brand/${brandId}/benefits`)}>
                Đến mục Phúc lợi
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit: any) => (
                <div key={benefit.id} className="p-4 rounded-2xl border border-border bg-background hover:border-primary/30 transition-colors flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-primary/10 text-primary rounded-md">
                      {benefit.benefitType}
                    </span>
                    {benefit.status === 'ACTIVE' ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">ACTIVE</span>
                    ) : (
                      <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">INACTIVE</span>
                    )}
                  </div>
                  <h4 className="font-bold mb-1">{benefit.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{benefit.description}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
