"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shirt,
  Sparkles,
  LayoutGrid,
  Store,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Code,
  ScanBarcode,
  ScanBarcodeIcon,
  ScanQrCode
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/features/auth/queries/auth.queries";
import { getUserAvatar } from "@/lib/utils";
import Image from "next/image";

export const NAV_ITEMS = [
  { icon: Shirt, label: "Wardrobe", path: "/wardrobe" },
  { icon: Sparkles, label: "AI Stylist", path: "/ai-stylist" },
  { icon: ScanQrCode, label: "Outfit", path: "/outfits" },
  { icon: LayoutGrid, label: "Community", path: "/community" },
  { icon: Store, label: "Marketplace", path: "/marketplace" },
];



export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuthStore = useAuthStore((state) => state.logout);
  const logoutMutation = useLogout();

  const handleLogout = () => {
    clearAuthStore();
    logoutMutation.mutate();
  };

  return (
    <aside className="hidden md:flex flex-col w-[280px] border-r border-border/60 h-dvh sticky top-0 bg-[#FAFAFA] dark:bg-[#111111] z-40 px-6 py-6">

      {/* Editorial Logo */}
      <div className="mb-6 flex flex-col pl-1">
        <div className="flex items-center gap-1.5 mb-1.5 opacity-50">
          <Sparkles className="size-3" />
          <span className="text-[9px] font-semibold tracking-[0.2em] uppercase">Smart Wardrobe</span>
        </div>
        <Link href="/" className="flex items-center group w-fit">
          <span className="font-display-lg text-4xl font-light tracking-tighter text-primary">
            Closy<span className="text-[#D9C5B2]">.</span>
          </span>
        </Link>
      </div>
      {/* Elegant User Profile with Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-4 mb-6 p-3 rounded-2xl bg-muted/20 border border-border/30 backdrop-blur-sm transition-all hover:bg-muted/40 cursor-pointer group outline-none">
            <Image
              src={getUserAvatar(user)}
              alt="Avatar"
              width={44}
              height={44}
              className="size-11 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#D9C5B2]/30 transition-all"
            />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-foreground truncate">
                {user?.name || "Ethos Atelier"}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">
                Xem hồ sơ
              </span>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px] rounded-2xl bg-background/95 backdrop-blur-xl border-border/40 p-2 shadow-xl">
          <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-muted/50 focus:bg-muted/50">
            <Link href="/profile/update" className="flex items-center gap-3 w-full text-foreground/80">
              <Settings className="size-4" />
              <span className="font-body-sm text-[13px] font-medium">Cài đặt</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-muted/50 focus:bg-muted/50">
            <Link href="/support" className="flex items-center gap-3 w-full text-foreground/80">
              <HelpCircle className="size-4" />
              <span className="font-body-sm text-[13px] font-medium">Hỗ trợ</span>
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
      <nav className="flex-1 flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "group flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative overflow-hidden",
                isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
            >
              {/* Active Indicator Line */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#D9C5B2] rounded-r-full" />
              )}

              <Icon
                className={cn(
                  "size-5 transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-[#D9C5B2]" : "text-muted-foreground group-hover:text-foreground"
                )}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span className={cn(
                "font-body-sm text-[14px] tracking-wide",
                isActive ? "font-semibold" : "font-medium"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Premium Upgrade (Minimal Style) */}
      {!user?.isPremium && (
        <div className="mt-auto mb-6 relative overflow-hidden rounded-2xl bg-muted/30 border border-border/50 p-5 group cursor-pointer transition-colors hover:bg-muted/50">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#D9C5B2]/20 rounded-full blur-2xl transition-colors duration-700 group-hover:bg-[#D9C5B2]/30" />

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
        </div>
      )}


    </aside>
  );
}
