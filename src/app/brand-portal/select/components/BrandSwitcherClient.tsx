"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useGetMyBrands } from '@/features/brand-portal/queries/brand-portal.queries';
import { Card, CardContent } from '@/components/ui/card';
import { Store, ArrowRight, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BrandSwitcherClient() {
  const router = useRouter();
  const { data: brands, isLoading, error } = useGetMyBrands();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Đang tải danh sách thương hiệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-destructive">
        <p>Không thể tải danh sách thương hiệu. Vui lòng thử lại sau.</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Thử lại
        </Button>
      </div>
    );
  }

  const brandsArray = Array.isArray(brands) ? brands : (brands as any)?.data || [];

  if (brandsArray.length === 0) {
    return (
      <Card className="max-w-md mx-auto rounded-3xl border-border bg-card shadow-sm p-8 text-center">
        <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2">Chưa có thương hiệu</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Tài khoản của bạn chưa được liên kết với bất kỳ thương hiệu nào. Bạn có thể đăng ký tạo thương hiệu mới.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" className="rounded-full" onClick={() => router.push('/auth/login')}>
            <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
          </Button>
          <Button className="rounded-full" onClick={() => router.push('/brand-portal/register')}>
            Đăng ký thương hiệu
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {brandsArray.map((brand: any) => {
        const status = brand.status?.toUpperCase() || '';
        const isActive = status === 'ACTIVE';
        const isPending = status === 'PENDING';
        
        return (
          <Card 
            key={brand.id} 
            className={`group rounded-3xl border-border bg-card shadow-sm transition-all overflow-hidden ${
              isActive ? 'hover:shadow-md hover:border-primary cursor-pointer' : 'opacity-80'
            }`}
            onClick={() => isActive && router.push(`/brand/${brand.id}/dashboard`)}
          >
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center shrink-0 border border-border overflow-hidden">
                  {brand.logoUrl ? (
                    <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-cover" />
                  ) : (
                    <Store className="w-8 h-8 text-muted-foreground/50" />
                  )}
                </div>
                <div>
                  <h3 className={`font-bold text-lg line-clamp-1 transition-colors ${isActive ? 'group-hover:text-primary text-foreground' : 'text-foreground'}`}>
                    {brand.name}
                  </h3>
                  <span className={`inline-flex mt-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                    isActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 
                    isPending ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 
                    'bg-muted text-muted-foreground'
                  }`}>
                    {isActive ? 'Hoạt động' : isPending ? 'Chờ duyệt' : status}
                  </span>
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                <span>{brand.id}</span>
                {isActive ? (
                  <span className="flex items-center gap-1 font-semibold group-hover:text-primary transition-colors">
                    Quản lý <ArrowRight className="w-4 h-4" />
                  </span>
                ) : isPending ? (
                  <span className="text-amber-600/70 text-xs font-medium">Đang chờ admin</span>
                ) : null}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Card Đăng ký thêm */}
      <Card 
        className="group rounded-3xl border border-dashed border-border bg-muted/20 hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
        onClick={() => router.push('/brand-portal/register')}
      >
        <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mb-3 group-hover:text-primary group-hover:border-primary/30 transition-colors">
          <Store className="w-5 h-5" />
        </div>
        <span className="font-bold text-foreground group-hover:text-primary transition-colors">Đăng ký thêm</span>
        <span className="text-xs text-muted-foreground mt-1">Tạo thương hiệu mới</span>
      </Card>
    </div>
  );
}
