"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, LayoutDashboard, Settings, NotebookTabsIcon, Menu, X, Store, LogOut, ChevronRight, ChevronsUpDown, Users, MessageCircle, Award, Gift, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetBrandProfile, useGetMyBrands } from '@/features/brand-portal/queries/brand-portal.queries';
import { BrandRoleProvider, useBrandRole } from '@/features/brand-portal/context/BrandRoleContext';
import { BRAND_PORTAL_HUB, BRAND_PORTAL_REGISTER, brandPortalPath } from '@/features/brand-portal/utils/routes';
import { isUuidLike } from '@/features/brand-portal/utils/brand-slug';

const ROLE_LABEL: Record<string, string> = {
  owner: 'Chủ thương hiệu',
  staff: 'Nhân viên',
};

const getNavItems = (brandId: string, isStaff: boolean) => {
  const items = [
    { href: brandPortalPath(brandId), label: 'Bảng điều khiển', icon: LayoutDashboard },
    { href: brandPortalPath(brandId, 'customers'), label: 'CRM Khách hàng', icon: Users },
    { href: brandPortalPath(brandId, 'chat'), label: 'Chat Inbox', icon: MessageCircle },
    { href: brandPortalPath(brandId, 'members'), label: 'Thành viên', icon: Users, hideForStaff: true },
    { href: brandPortalPath(brandId, 'loyalty'), label: 'Chương trình điểm', icon: Award, hideForStaff: true },
    { href: brandPortalPath(brandId, 'benefits'), label: 'Quyền lợi', icon: Gift, hideForStaff: true },
    { href: brandPortalPath(brandId, 'products'), label: 'Sản phẩm', icon: Package },
    { href: brandPortalPath(brandId, 'digital-sample-lab/report'), label: 'Báo cáo thử mẫu', icon: NotebookTabsIcon },
  ];
  return items.filter(item => !(isStaff && item.hideForStaff));
};



function SidebarNav({ brandId, onNavigate }: { brandId: string, onNavigate?: () => void }) {
  const pathname = usePathname();
  const { isStaff } = useBrandRole();
  const navItems = getNavItems(brandId, isStaff);

  return (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'
              }`}
          >
            <Icon className="w-5 h-5" /> {item.label}
          </Link>
        );
      })}
    </>
  );
}

function BrandSwitcher({
  brandId,
  brandName,
  brandLogoUrl,
  onNavigate,
}: {
  brandId: string;
  brandName: string;
  brandLogoUrl?: string | null;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const { memberRole } = useBrandRole();
  const { data: brands } = useGetMyBrands();
  const otherBrands = (Array.isArray(brands) ? brands : []).filter(
    (brand) => brand.slug !== brandId && brand.status?.toUpperCase() === 'ACTIVE',
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Chọn thương hiệu đang quản lý, hiện tại ${brandName}`}
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-muted/30 p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/50"
        >
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background text-sm font-bold">
            {brandLogoUrl ? (
              <img src={brandLogoUrl} alt={brandName} className="size-full object-cover" />
            ) : (
              brandName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{brandName}</p>
            <p className="truncate text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {memberRole ? ROLE_LABEL[memberRole] : 'Đang tải...'}
            </p>
          </div>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 rounded-2xl border border-border bg-card p-2 shadow-xl">
        {otherBrands.length > 0 && (
          <>
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Chuyển thương hiệu
            </p>
            {otherBrands.map((brand) => (
              <DropdownMenuItem
                key={brand.id}
                className="cursor-pointer rounded-xl px-3 py-2.5"
                onClick={() => {
                  onNavigate?.();
                  router.push(brandPortalPath(brand.slug || brand.id));
                }}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Store className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate font-semibold">{brand.name}</span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="my-1 bg-border" />
          </>
        )}
        <DropdownMenuItem asChild className="cursor-pointer rounded-xl px-3 py-2.5">
          <Link href={BRAND_PORTAL_HUB} onClick={onNavigate} className="flex items-center gap-2">
            <LayoutDashboard className="size-4 text-muted-foreground" />
            <span className="font-semibold">Quản lý tất cả thương hiệu</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer rounded-xl px-3 py-2.5">
          <Link href={BRAND_PORTAL_REGISTER} onClick={onNavigate} className="flex items-center gap-2">
            <Store className="size-4 text-muted-foreground" />
            <span className="font-semibold">Tạo thương hiệu mới</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProfileMenu({ brandId, brandName, onNavigate }: { brandId: string, brandName: string, onNavigate?: () => void }) {
  const { isStaff, memberRole } = useBrandRole();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={`Tài khoản thương hiệu ${brandName}`} className="flex flex-col text-left">
          <div className="flex items-center gap-3 p-3 bg-muted/30 border border-border hover:border-primary transition-all cursor-pointer group outline-none shadow-sm rounded-xl">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
              {brandName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-bold text-sm text-foreground truncate">{brandName}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">Brand</span>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          </div>
          {/* Role badge below the profile menu */}
          <div className="mt-2 flex items-center justify-center gap-1.5 bg-muted/50 py-1.5 px-3 rounded-lg border border-border">
            {isStaff ? <ShieldAlert className="size-3.5 text-orange-500" /> : <ShieldCheck className="size-3.5 text-green-500" />}
            <span className="text-xs font-semibold capitalize tracking-wider text-muted-foreground">Vai trò: {memberRole ? ROLE_LABEL[memberRole] : 'Đang tải...'}</span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-[240px] rounded-2xl border border-border bg-card p-2 shadow-xl mb-2">
        {!isStaff && (
          <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-muted focus:bg-muted">
            <Link href={brandPortalPath(brandId, 'profile')} className="flex items-center gap-3 w-full text-foreground" onClick={onNavigate}>
              <Store className="size-4 text-muted-foreground" />
              <span className="font-semibold text-[11px] uppercase tracking-widest">Hồ sơ thương hiệu</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="my-1 bg-border" />
        <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 transition-colors">
          <Link href="/auth/login" className="flex items-center gap-3 w-full" onClick={onNavigate}>
            <LogOut className="size-4" />
            <span className="font-semibold text-[11px] uppercase tracking-widest">Đăng xuất</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function BrandLayoutInner({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const brandId = params.brandSlug as string;
  const { data: brandProfile } = useGetBrandProfile(brandId);

  useEffect(() => {
    if (!brandProfile?.slug || brandProfile.slug === brandId) return;
    if (!isUuidLike(brandId)) return;
    const suffix = pathname.replace(`/brand-portal/${brandId}`, '');
    router.replace(`${BRAND_PORTAL_HUB}/${brandProfile.slug}${suffix}`);
  }, [brandProfile?.slug, brandId, pathname, router]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  
  const brandName = brandProfile?.name || 'Loading...';

  return (
    <div className="flex h-dvh bg-background text-foreground overflow-hidden relative">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-card flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="font-bold text-lg tracking-tight uppercase">Không gian<br /> thương hiệu</span>
        </div>
        <div className="px-4 pt-4">
          <BrandSwitcher brandId={brandId} brandName={brandName} brandLogoUrl={brandProfile?.logoUrl} />
        </div>
        <nav className="flex-1 py-4 px-4 flex flex-col gap-2 overflow-y-auto">
          <SidebarNav brandId={brandId} />
        </nav>
        <div className="p-4 border-t border-border flex flex-col gap-3">
          <Link href={`/brands/${brandId}`} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-bold text-sm transition-colors text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" /> Về trang Shopper
          </Link>
          <ProfileMenu brandId={brandId} brandName={brandName} />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeMobileMenu}></div>
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-card z-50 flex flex-col transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <span className="font-bold text-lg tracking-tight uppercase">Không gian <br /> thương hiệu</span>
          <button aria-label="Đóng menu thương hiệu" onClick={closeMobileMenu} className="p-1 -mr-2">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-4 pt-4">
          <BrandSwitcher brandId={brandId} brandName={brandName} brandLogoUrl={brandProfile?.logoUrl} onNavigate={closeMobileMenu} />
        </div>
        <nav className="flex-1 py-4 px-4 flex flex-col gap-2 overflow-y-auto">
          <SidebarNav brandId={brandId} onNavigate={closeMobileMenu} />
        </nav>
        <div className="p-4 border-t border-border flex flex-col gap-3">
          <Link href={`/brands/${brandId}`} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-bold text-sm transition-colors text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" /> Về trang Shopper
          </Link>
          <ProfileMenu brandId={brandId} brandName={brandName} onNavigate={closeMobileMenu} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="h-16 border-b border-border bg-card flex items-center px-4 lg:px-8 shrink-0">
          <button aria-label="Mở menu thương hiệu" className="lg:hidden p-2 -ml-2 text-foreground mr-4" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-bold text-sm text-muted-foreground uppercase tracking-widest">{brandName}</div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const brandId = params.brandSlug as string;

  return (
    <BrandRoleProvider brandId={brandId}>
      <BrandLayoutInner>{children}</BrandLayoutInner>
    </BrandRoleProvider>
  );
}
