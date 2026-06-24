"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useB2BDemoStore } from "@/lib/mock-data/b2b/store";
import { useLogout } from "@/features/auth/queries/auth.queries";
import { getUserAvatar } from "@/lib/utils";
import Image from "next/image";

export const NAV_ITEMS = [
  { icon: PlusCircle, label: "Thêm Đồ Nhanh", path: "/wardrobe/explore" },
  { icon: Shirt, label: "Tủ Quần Áo", path: "/wardrobe" },
  { icon: Sparkles, label: "AI Phối Đồ", path: "/ai-stylist" },
  { icon: ScanQrCode, label: "Trang Phục", path: "/outfits" },
  { icon: Globe, label: "Cộng Đồng", path: "/community" },
  { icon: Store, label: "Thanh Lý", path: "/marketplace", comingSoon: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuthStore = useAuthStore((state) => state.logout);
  const logoutMutation = useLogout();
  const { cart, setCartOpen } = useB2BDemoStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    clearAuthStore();
    logoutMutation.mutate();
  };

  return (
    <aside className={cn(
      "hidden md:flex flex-col border-r border-border/60 h-dvh sticky top-0 bg-[#FAFAFA] dark:bg-[#111111] z-40 py-6 transition-all duration-300",
      isCollapsed ? "w-[88px] px-3" : "w-[280px] px-6"
    )}>
      
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-background border border-border/60 rounded-full p-1 z-50 text-muted-foreground hover:text-foreground transition-colors"
      >
        {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
      </button>

      {/* Editorial Logo */}
      <div className={cn("mb-6 flex flex-col transition-all", isCollapsed ? "items-center" : "pl-1")}>
        {!isCollapsed && (
          <div className="flex items-center gap-1.5 mb-1.5 opacity-50">
            <Sparkles className="size-3" />
            <span className="text-[9px] font-semibold tracking-[0.2em] uppercase">Tủ đồ thông minh</span>
          </div>
        )}
        <Link href="/" className="flex items-center group w-fit">
          <span className={cn(
            "font-['Playfair_Display'] font-light tracking-tighter text-primary transition-all",
            isCollapsed ? "text-2xl" : "text-4xl"
          )}>
            {isCollapsed ? <img src="/favicon.ico"></img> : <><span className="font-['Playfair_Display']"> Closy </span><span className="text-[#D9C5B2]">.</span></>}
          </span>
        </Link>
      </div>

      {/* Elegant User Profile with Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className={cn(
            "flex items-center mb-6 rounded-2xl bg-muted/20 border border-border/30 backdrop-blur-sm transition-all hover:bg-muted/40 cursor-pointer group outline-none",
            isCollapsed ? "p-2 justify-center" : "p-3 gap-4"
          )}>
            <Image
              src={getUserAvatar(user)}
              alt="Avatar"
              width={44}
              height={44}
              className={cn(
                "rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#D9C5B2]/30 transition-all",
                isCollapsed ? "size-10" : "size-11"
              )}
            />
            {!isCollapsed && (
              <>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {user?.name || "Ethos Atelier"}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">
                    Xem hồ sơ
                  </span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isCollapsed ? "start" : "end"} side={isCollapsed ? "right" : "bottom"} sideOffset={isCollapsed ? 12 : 4} className="w-[240px] rounded-2xl bg-background/95 backdrop-blur-xl border-border/40 p-2 shadow-xl">
          <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-muted/50 focus:bg-muted/50">
            <Link href="/profile" className="flex items-center gap-3 w-full text-foreground/80">
              <User className="size-4" />
              <span className="font-body-sm text-[13px] font-medium">Hồ sơ</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-muted/50 focus:bg-muted/50">
            <Link href="/profile/purchases" className="flex items-center gap-3 w-full text-foreground/80">
              <ShoppingBag className="size-4" />
              <span className="font-body-sm text-[13px] font-medium">Đơn hàng</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-muted/50 focus:bg-muted/50">
            <Link href="/profile/update" className="flex items-center gap-3 w-full text-foreground/80">
              <Settings className="size-4" />
              <span className="font-body-sm text-[13px] font-medium">Cài đặt</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1 bg-border/40" />
          <DropdownMenuItem
            onClick={handleLogout}
            className="rounded-xl px-3 py-2.5 cursor-pointer text-red-500/80 hover:text-red-500 hover:bg-red-500/10 focus:text-red-500 focus:bg-red-500/10"
          >
            <div className="flex items-center gap-3 w-full">
              <LogOut className="size-4" />
              <span className="font-body-sm text-[13px] font-medium">Đăng xuất</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Main Navigation (Minimalist List) */}
      <nav className="flex-1 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.path === '/wardrobe'
            ? pathname === '/wardrobe' || (pathname.startsWith('/wardrobe/') && !pathname.startsWith('/wardrobe/explore'))
            : pathname.startsWith(item.path);

          const Icon = item.icon;

          const content = (
            <Link
              href={item.path}
              className={cn(
                "group flex items-center rounded-xl transition-all relative overflow-hidden",
                isCollapsed ? "justify-center p-3" : "gap-4 px-4 py-3",
                isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
            >
              {/* Active Indicator Line */}
              {isActive && (
                <span className={cn(
                  "absolute bg-[#D9C5B2] rounded-r-full",
                  isCollapsed ? "left-0 top-1/2 -translate-y-1/2 w-1 h-1/2" : "left-0 top-1/2 -translate-y-1/2 w-1 h-1/2"
                )} />
              )}

              <Icon
                className={cn(
                  "size-5 transition-transform duration-300 group-hover:scale-110 flex-shrink-0",
                  isActive ? "text-[#D9C5B2]" : "text-muted-foreground group-hover:text-foreground"
                )}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              {!isCollapsed && (
                <>
                  <span className={cn(
                    "font-body-sm text-[14px] tracking-wide truncate",
                    isActive ? "font-semibold" : "font-medium"
                  )}>
                    {item.label}
                  </span>
                  {item.comingSoon && (
                    <span className="ml-auto flex-shrink-0 text-[9px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm bg-foreground text-background">
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
                <TooltipTrigger asChild>
                  {content}
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12} className="font-['IBM_Plex_Mono'] text-xs font-medium uppercase tracking-widest">
                  {item.label} {item.comingSoon && "(Sắp ra mắt)"}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.path}>{content}</div>;
        })}
      </nav>

      {/* Cart Button */}
      <div className="mb-4 mt-2">
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
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
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12} className="font-['IBM_Plex_Mono'] text-xs font-medium uppercase tracking-widest">
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
      </div>

      {/* Premium Upgrade (Minimal Style) */}
      {!user?.isPremium && (
        <div className={cn(
          "mt-auto mb-6 relative overflow-hidden rounded-2xl bg-muted/30 border border-border/50 group cursor-pointer transition-colors hover:bg-muted/50",
          isCollapsed ? "p-3 flex justify-center items-center" : "p-5"
        )}>
          {!isCollapsed && <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#D9C5B2]/20 rounded-full blur-2xl transition-colors duration-700 group-hover:bg-[#D9C5B2]/30" />}

          {isCollapsed ? (
             <Tooltip>
               <TooltipTrigger asChild>
                 <Link href="/pricing">
                   <Sparkles className="size-5 text-foreground/80 group-hover:text-[#D9C5B2] transition-colors" />
                 </Link>
               </TooltipTrigger>
               <TooltipContent side="right" sideOffset={12} className="font-['IBM_Plex_Mono'] text-xs font-medium uppercase tracking-widest text-[#D9C5B2]">
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
                <span className="border-b border-foreground/30 pb-0.5 group-hover/btn:border-foreground/70 transition-colors">Nâng cấp ngay</span>
                <ChevronRight className="size-3 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      )}

    </aside>
  );
}
