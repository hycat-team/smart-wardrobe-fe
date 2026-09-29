'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Shirt,
  Sparkles,
  LayoutGrid,
  Store,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  ScanQrCode,
  PlusCircle,
  User,
  ShoppingBag,
  PanelLeftClose,
  PanelLeftOpen,
  Globe,
  Compass,
  type LucideIcon,
  Images,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { useB2BDemoStore } from '@/lib/mock-data/b2b/store';
import { useLogout } from '@/features/auth/queries/auth.queries';
import { getUserAvatar } from '@/lib/utils';
import Image from 'next/image';
import { useSidebarStore } from '@/store/useSidebarStore';

export type NavItem = {
  icon: LucideIcon;
  label: string;
  path: string;
  comingSoon?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  // { icon: PlusCircle, label: "Thêm Đồ Nhanh", path: "/wardrobe/explore" },
  { icon: Globe, label: 'Cộng Đồng', path: '/community' },
  // { icon: Compass, label: "Khám Phá", path: "/brands" },
  { icon: Shirt, label: 'Tủ Quần Áo', path: '/wardrobe' },
  { icon: Sparkles, label: 'AI Phối Đồ', path: '/ai-stylist' },
  { icon: Images, label: 'Trang Phục', path: '/outfits' },
  // { icon: Store, label: "Kênh Thương Hiệu", path: "/brand-portal/select" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const displayName =
    user?.name ||
    (user?.firstName ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}` : '') ||
    user?.username ||
    'Ethos Atelier';
  const clearAuthStore = useAuthStore((state) => state.logout);
  const logoutMutation = useLogout();
  const { cart, setCartOpen } = useB2BDemoStore();
  const { isCollapsed, setIsCollapsed, toggleCollapse } = useSidebarStore();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('closy_sidebar_collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }
  }, [setIsCollapsed]);

  // Reset hover state whenever route changes to avoid phantom gliding
  useEffect(() => {
    setHoveredPath(null);
  }, [pathname]);

  const handleToggleCollapse = () => {
    toggleCollapse();
  };

  const handleLogout = () => {
    clearAuthStore();
    logoutMutation.mutate();
  };

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-border/60 h-dvh sticky top-0 bg-[#FAFAFA] dark:bg-[#111111] z-40 py-6 transition-all duration-300',
        isCollapsed ? 'w-[88px] px-3' : 'w-[280px] px-6'
      )}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={handleToggleCollapse}
        className="absolute -right-3 top-8 bg-background border border-border/60 rounded-full p-1 z-50 text-muted-foreground hover:text-foreground transition-colors"
      >
        {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
      </button>

      {/* Editorial Logo */}
      <div
        className={cn('mb-6 flex flex-col transition-all', isCollapsed ? 'items-center' : 'pl-1')}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-1.5 mb-2 text-stone-400 dark:text-stone-500">
            <Sparkles className="size-3 text-[#D9C5B2]" />
            <span className="text-[9.5px] font-semibold tracking-[0.2em] uppercase">
              Tủ đồ thông minh
            </span>
          </div>
        )}
        <Link href="/" className="flex items-center gap-2.5 group w-fit">
          {isCollapsed ? (
            <img
              src="/brand/logo-only.png"
              alt="Closy - Smart Wardrobe Logo"
              width={36}
              height={36}
              className="w-9 h-9 object-contain rounded-full transition-transform group-hover:scale-105"
            />
          ) : (
            <>
              <img
                src="/brand/logo-only.png"
                alt="Closy - Smart Wardrobe Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain rounded-full transition-transform group-hover:scale-105"
              />
              <span className="font-semibold text-3xl font-light tracking-tighter text-primary transition-all">
                <span className="font-semibold">Closy</span>
                <span className="text-[#D9C5B2]">.</span>
              </span>
            </>
          )}
        </Link>
      </div>

      {/* Elegant User Profile with Dropdown */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              'relative flex items-center mb-6 rounded-2xl cursor-pointer group outline-none transition-all duration-200',
              'bg-white dark:bg-[#18181b] border border-stone-200/90 dark:border-stone-800 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06),0_1px_3px_0_rgba(0,0,0,0.04)]',
              'hover:shadow-[0_6px_16px_-4px_rgba(0,0,0,0.09)] hover:border-[#D9C5B2]/80 dark:hover:border-[#D9C5B2]/60 hover:-translate-y-0.5',
              isCollapsed ? 'p-2 justify-center' : 'p-3 gap-3.5'
            )}
          >
            <div className="relative shrink-0">
              <Image
                src={getUserAvatar(user)}
                alt="Avatar"
                width={44}
                height={44}
                className={cn(
                  'rounded-full object-cover ring-2 ring-stone-200/80 dark:ring-stone-700/80 group-hover:ring-[#D9C5B2] shadow-xs transition-all duration-300',
                  isCollapsed ? 'size-10' : 'size-11'
                )}
              />
              <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#18181b]" />
            </div>

            {!isCollapsed && (
              <>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13.5px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {displayName}
                    </span>
                    {user?.isPremium && (
                      <Sparkles className="size-3 text-[#D9C5B2] shrink-0 fill-[#D9C5B2]/20" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 group-hover:text-foreground transition-colors">
                      Xem hồ sơ
                    </span>
                    {user?.roleSlug === 'admin' && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400">
                        Admin
                      </span>
                    )}
                    {user?.isPremium && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-[#D9C5B2]/20 text-[#8C6D53] dark:text-[#E8D8C8]">
                        VIP
                      </span>
                    )}
                  </div>
                </div>

                <div className="size-6 rounded-full flex items-center justify-center bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-400 group-hover:bg-[#D9C5B2]/20 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0">
                  <ChevronRight className="size-3.5" />
                </div>
              </>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={isCollapsed ? 'start' : 'start'}
          side={isCollapsed ? 'right' : 'bottom'}
          sideOffset={isCollapsed ? 12 : 8}
          className="w-[264px] rounded-2xl bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-xl border border-stone-200/90 dark:border-stone-800 p-2 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06)]"
        >
          {/* Membership Status / Upgrade Banner */}
          {user?.isPremium ? (
            <div className="px-3 py-2 mb-1 rounded-xl bg-gradient-to-r from-[#D9C5B2]/20 via-[#D9C5B2]/10 to-transparent border border-[#D9C5B2]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-[#8C6D53] dark:text-[#E8D8C8]" />
                <span className="text-[11.5px] font-semibold text-[#8C6D53] dark:text-[#E8D8C8]">
                  Thành viên VIP
                </span>
              </div>
              <Link
                href="/pricing"
                className="text-[10.5px] font-semibold text-[#8C6D53] dark:text-[#E8D8C8] hover:underline"
              >
                Gói cước
              </Link>
            </div>
          ) : (
            <Link
              href="/pricing"
              className="px-3 py-2 mb-1 rounded-xl bg-[#111111] dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-between group hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-[#D9C5B2]" />
                <span className="text-[11.5px] font-medium">Nâng cấp VIP</span>
              </div>
              <ChevronRight className="size-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}

          <DropdownMenuSeparator className="my-1.5 bg-stone-200/70 dark:bg-stone-800" />

          {/* Navigation Menu Items */}
          <div className="space-y-0.5">
            <DropdownMenuItem
              asChild
              className="rounded-xl px-2.5 py-2 cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800/70 focus:bg-stone-100 dark:focus:bg-stone-800/70 transition-colors group/item"
            >
              <Link href="/profile" className="flex items-center gap-3 w-full">
                <div className="size-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 group-hover/item:bg-[#D9C5B2]/20 group-hover/item:text-[#8C6D53] dark:group-hover/item:text-[#E8D8C8] transition-colors shrink-0">
                  <User className="size-4" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[13px] font-medium text-foreground group-hover/item:text-primary transition-colors">
                    Hồ sơ cá nhân
                  </span>
                  <span className="text-[10.5px] text-muted-foreground truncate">
                    Thông tin & số đo cơ thể
                  </span>
                </div>
                <ChevronRight className="size-3.5 text-stone-300 dark:text-stone-600 group-hover/item:text-foreground group-hover/item:translate-x-0.5 transition-all shrink-0" />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="rounded-xl px-2.5 py-2 cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800/70 focus:bg-stone-100 dark:focus:bg-stone-800/70 transition-colors group/item"
            >
              <Link href="/profile/update" className="flex items-center gap-3 w-full">
                <div className="size-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 group-hover/item:bg-[#D9C5B2]/20 group-hover/item:text-[#8C6D53] dark:group-hover/item:text-[#E8D8C8] transition-colors shrink-0">
                  <Settings className="size-4" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[13px] font-medium text-foreground group-hover/item:text-primary transition-colors">
                    Cài đặt tài khoản
                  </span>
                  <span className="text-[10.5px] text-muted-foreground truncate">
                    Mật khẩu & quyền riêng tư
                  </span>
                </div>
                <ChevronRight className="size-3.5 text-stone-300 dark:text-stone-600 group-hover/item:text-foreground group-hover/item:translate-x-0.5 transition-all shrink-0" />
              </Link>
            </DropdownMenuItem>

            {user?.roleSlug === 'admin' && (
              <DropdownMenuItem
                asChild
                className="rounded-xl px-2.5 py-2 cursor-pointer hover:bg-red-50/70 dark:hover:bg-red-950/30 focus:bg-red-50/70 dark:focus:bg-red-950/30 transition-colors group/item"
              >
                <Link href="/admin/brands" className="flex items-center gap-3 w-full">
                  <div className="size-8 rounded-lg bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 group-hover/item:bg-red-200 dark:group-hover/item:bg-red-900/50 transition-colors shrink-0">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[13px] font-medium text-red-600 dark:text-red-400">
                      Quản trị hệ thống
                    </span>
                    <span className="text-[10.5px] text-red-500/70 truncate">
                      Cổng điều hành Admin
                    </span>
                  </div>
                  <ChevronRight className="size-3.5 text-red-300 dark:text-red-700 group-hover/item:text-red-500 group-hover/item:translate-x-0.5 transition-all shrink-0" />
                </Link>
              </DropdownMenuItem>
            )}
          </div>

          <DropdownMenuSeparator className="my-1.5 bg-stone-200/70 dark:bg-stone-800" />

          {/* Logout Action */}
          <DropdownMenuItem
            onClick={handleLogout}
            className="rounded-xl px-2.5 py-2 cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 focus:text-red-600 transition-colors group/item"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="size-8 rounded-lg bg-red-100/70 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 group-hover/item:bg-red-200 dark:group-hover/item:bg-red-900/50 transition-colors shrink-0">
                <LogOut className="size-4" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[13px] font-medium leading-tight">Đăng xuất</span>
                <span className="text-[10.5px] text-red-400/80 truncate">
                  Kết thúc phiên làm việc
                </span>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Main Navigation (Minimalist List with Motion) */}
      <nav className="flex-1 flex flex-col gap-1.5" onMouseLeave={() => setHoveredPath(null)}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.path === '/wardrobe'
              ? pathname === '/wardrobe' ||
                (pathname.startsWith('/wardrobe/') && !pathname.startsWith('/wardrobe/explore'))
              : pathname.startsWith(item.path);

          const Icon = item.icon;

          const content = (
            <Link
              href={item.path}
              onMouseEnter={() => setHoveredPath(item.path)}
              className={cn(
                'group flex items-center rounded-xl relative select-none outline-none transition-colors duration-150',
                isCollapsed ? 'justify-center p-3' : 'gap-4 px-4 py-3'
              )}
            >
              {/* Hover Pill (Fade in/out on hovered item without phantom gliding) */}
              {hoveredPath === item.path && !isActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-stone-100/80 dark:bg-white/[0.05] pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.05 }}
                />
              )}

              {/* Active Pill Background (Smooth spring animation when switching pages) */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  initial={false}
                  className="absolute inset-0 rounded-xl bg-[#F4EEE8] dark:bg-white/[0.08] border border-[#D9C5B2]/30 shadow-[0_1px_4px_rgba(0,0,0,0.03)] pointer-events-none"
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 32,
                    mass: 0.8,
                  }}
                />
              )}

              {/* Active Indicator Line (Magnetic glide along sidebar) */}
              {isActive && (
                <motion.span
                  layoutId="sidebar-active-indicator"
                  initial={false}
                  className={cn(
                    'absolute left-0 top-1/2 -translate-y-1/2 bg-[#D9C5B2] rounded-r-full z-20 pointer-events-none shadow-[0_0_12px_rgba(217,197,178,0.7)]',
                    isCollapsed ? 'w-1 h-5' : 'w-1.5 h-6'
                  )}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 32,
                    mass: 0.8,
                  }}
                />
              )}

              {/* Icon with subtle spring micro-interaction */}
              <motion.div
                animate={{
                  scale: isActive ? 1.05 : 1,
                }}
                whileHover={{ scale: 1.15, rotate: isActive ? 0 : 2 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                className="relative z-10 flex items-center justify-center flex-shrink-0"
              >
                <Icon
                  className={cn(
                    'size-5 transition-colors duration-200',
                    isActive
                      ? 'text-[#D9C5B2]'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
              </motion.div>

              {!isCollapsed && (
                <>
                  <span
                    className={cn(
                      'font-body-sm text-[14px] tracking-wide truncate relative z-10 transition-colors duration-200',
                      isActive
                        ? 'font-semibold text-foreground'
                        : 'font-medium text-muted-foreground group-hover:text-foreground'
                    )}
                  >
                    {item.label}
                  </span>
                  {item.comingSoon && (
                    <span className="ml-auto flex-shrink-0 text-[9px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm bg-foreground text-background relative z-10">
                      Sắp ra mắt
                    </span>
                  )}
                </>
              )}
            </Link>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={item.path}>
                <TooltipTrigger render={<div />}>{content}</TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={12}
                  className="font-semibold text-xs font-medium uppercase tracking-widest"
                >
                  {item.label} {item.comingSoon && '(Sắp ra mắt)'}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.path}>{content}</div>;
        })}
      </nav>

      {/* Cart Button */}
      {/* <div className="mb-4 mt-2">
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger
              onClick={() => setCartOpen(true)}
              className="group flex items-center justify-center w-full p-3 rounded-xl transition-all relative overflow-hidden text-muted-foreground hover:text-foreground hover:bg-muted/30"
            >
              <div className="relative">
                <ShoppingBag className="size-5 transition-transform duration-300 group-hover:scale-110 text-muted-foreground group-hover:text-foreground" strokeWidth={1.5} />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center bg-foreground text-background text-[9px] font-bold w-4 h-4 rounded-full z-10 shadow-sm border border-background">
                    {cart.length}
                  </span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12} className="font-semibold text-xs font-medium uppercase tracking-widest">
              Giỏ Hàng
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={() => setCartOpen(true)}
            className="group flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all relative overflow-hidden text-muted-foreground hover:text-foreground hover:bg-muted/30"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingBag className="size-5 transition-transform duration-300 group-hover:scale-110 text-muted-foreground group-hover:text-foreground" strokeWidth={1.5} />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center bg-foreground text-background text-[9px] font-bold w-4 h-4 rounded-full z-10 shadow-sm border border-background">
                    {cart.length}
                  </span>
                )}
              </div>
              <span className="font-body-sm text-[14px] tracking-wide font-medium">Giỏ Hàng</span>
            </div>
          </button>
        )}
      </div> */}

      {/* Premium Upgrade (Minimal Style) */}
      {!user?.isPremium && (
        <div
          className={cn(
            'mt-auto mb-6 relative overflow-hidden rounded-2xl bg-muted/30 border border-border/50 group cursor-pointer transition-colors hover:bg-muted/50',
            isCollapsed ? 'p-3 flex justify-center items-center' : 'p-5'
          )}
        >
          {!isCollapsed && (
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#D9C5B2]/20 rounded-full blur-2xl transition-colors duration-700 group-hover:bg-[#D9C5B2]/30" />
          )}

          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger render={<div />}>
                <Link href="/pricing">
                  <Sparkles className="size-5 text-foreground/80 group-hover:text-[#D9C5B2] transition-colors" />
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={12}
                className="font-semibold text-xs font-medium uppercase tracking-widest text-[#D9C5B2]"
              >
                Nâng Cấp Premium
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-foreground/80 group-hover:text-[#D9C5B2] transition-colors" />
                  <span className="font-title-lg text-[11px] font-bold tracking-[0.2em] uppercase text-foreground/90 group-hover:text-foreground transition-colors">
                    Premium
                  </span>
                </div>
              </div>
              <p className="font-body-sm text-[13px] text-muted-foreground/90 leading-relaxed pr-4">
                Nâng tầm phong cách với gợi ý không giới hạn từ AI.
              </p>
              <Link
                href="/pricing"
                className="mt-3 inline-flex items-center gap-2 text-foreground/90 font-medium text-[13px] group/btn"
              >
                <span className="border-b border-foreground/30 pb-0.5 group-hover/btn:border-foreground/70 transition-colors">
                  Nâng cấp ngay
                </span>
                <ChevronRight className="size-3 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
