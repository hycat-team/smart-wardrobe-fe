'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGetMyBrands } from '@/features/brand-portal/queries/brand-portal.queries';
import { BRAND_PORTAL_REGISTER, brandPortalPath } from '@/features/brand-portal/utils/routes';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, ArrowRight, Loader2, Plus, ShieldCheck, ShieldAlert } from 'lucide-react';

const ROLE_LABEL: Record<string, string> = {
  owner: 'Chủ thương hiệu',
  staff: 'Nhân viên',
};

export default function BrandHubClient() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { data: brands, isLoading, error, refetch } = useGetMyBrands(!!user);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <Store className="w-12 h-12 text-muted-foreground/50" />
        <div>
          <h2 className="text-xl font-bold">Đăng nhập để quản lý thương hiệu</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Bạn cần đăng nhập bằng tài khoản thuộc thương hiệu để tiếp tục.
          </p>
        </div>
        <Button className="rounded-full" onClick={() => router.push('/auth/login')}>
          Đăng nhập
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Đang tải danh sách thương hiệu...</p>
      </div>
    );
  }

  if (error) {
    const status = (error as { response?: { status?: number } }).response?.status;
    const isUnauthorized = status === 401;
    const isForbidden = status === 403;
    const message = isUnauthorized
      ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      : isForbidden
        ? 'Tài khoản của bạn chưa phải thành viên đang hoạt động của thương hiệu nào.'
        : 'Không thể tải danh sách thương hiệu. Vui lòng thử lại sau.';

    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <ShieldAlert className="w-10 h-10 text-destructive" />
        <p className="text-destructive font-semibold">{message}</p>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => (isUnauthorized ? router.push('/auth/login') : refetch())}
        >
          {isUnauthorized ? 'Đăng nhập lại' : 'Thử lại'}
        </Button>
      </div>
    );
  }

  const brandList = Array.isArray(brands) ? brands : [];

  if (brandList.length === 0) {
    return (
      <Card className="max-w-md mx-auto rounded-3xl border-border bg-card shadow-sm p-8 text-center">
        <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2">Chưa có thương hiệu</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Tài khoản của bạn chưa được liên kết với thương hiệu nào. Bạn có thể đăng ký tạo thương hiệu mới.
        </p>
        <Button className="rounded-full" render={<Link href={BRAND_PORTAL_REGISTER} />}>
          Đăng ký thương hiệu
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {brandList.map((brand) => {
        const status = brand.status?.toUpperCase() || '';
        const isActive = status === 'ACTIVE';
        const isPending = status === 'PENDING' || status === 'PENDING_REVIEW';
        const roleLabel = brand.memberRole ? ROLE_LABEL[brand.memberRole] : null;

        const card = (
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center shrink-0 border border-border overflow-hidden">
                {brand.logoUrl ? (
                  <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-8 h-8 text-muted-foreground/50" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className={`font-bold text-lg line-clamp-1 transition-colors ${isActive ? 'group-hover:text-primary text-foreground' : 'text-foreground'}`}>
                  {brand.name}
                </h3>
                {roleLabel && (
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {brand.memberRole === 'owner' ? (
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <ShieldAlert className="w-3 h-3 text-amber-600" />
                    )}
                    {roleLabel}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
              <span
                className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : isPending
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {isActive ? 'Hoạt động' : isPending ? 'Chờ duyệt' : status}
              </span>
              {isActive ? (
                <span className="flex items-center gap-1 font-semibold group-hover:text-primary transition-colors">
                  Quản lý <ArrowRight className="w-4 h-4" />
                </span>
              ) : isPending ? (
                <span className="text-amber-600/70 text-xs font-medium">Đang chờ admin</span>
              ) : null}
            </div>
          </CardContent>
        );

        return isActive ? (
          <Link key={brand.id} href={brandPortalPath(brand.slug || brand.id)} className="group block">
            <Card className="rounded-3xl border-border bg-card shadow-sm transition-all overflow-hidden hover:shadow-md hover:border-primary cursor-pointer">
              {card}
            </Card>
          </Link>
        ) : (
          <Card key={brand.id} className="rounded-3xl border-border bg-card shadow-sm overflow-hidden opacity-80">
            {card}
          </Card>
        );
      })}

      <Link href={BRAND_PORTAL_REGISTER} className="group block">
        <Card className="rounded-3xl border border-dashed border-border bg-muted/20 hover:bg-muted/50 hover:border-primary/50 transition-all flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mb-3 group-hover:text-primary group-hover:border-primary/30 transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          <span className="font-bold text-foreground group-hover:text-primary transition-colors">Đăng ký thêm</span>
          <span className="text-xs text-muted-foreground mt-1">Tạo thương hiệu mới</span>
        </Card>
      </Link>
    </div>
  );
}
