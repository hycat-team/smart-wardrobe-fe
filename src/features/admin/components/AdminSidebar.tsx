'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  UsersIcon, 
  MessageSquareIcon, 
  GridIcon, 
  LayoutDashboardIcon, 
  LogOutIcon, 
  TrendingUp,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { useLogout } from '@/features/auth/queries/auth.queries';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { href: '/admin/users', label: 'Người dùng', icon: UsersIcon },
  { href: '/admin/moderation', label: 'Kiểm duyệt', icon: MessageSquareIcon },
  { href: '/admin/wardrobe', label: 'Trang phục Hệ thống', icon: GridIcon },
  { href: '/admin/catalog', label: 'Loại đồ (Catalog)', icon: GridIcon },
  { href: '/admin/trends', label: 'Xu hướng', icon: TrendingUp },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuthStore = useAuthStore((state) => state.logout);
  const logoutMutation = useLogout();

  const handleLogout = () => {
    clearAuthStore();
    logoutMutation.mutate();
    router.push('/');
  };

  return (
    <aside className="hidden md:flex flex-col w-[280px] border-r border-border/60 h-dvh sticky top-0 bg-[#FAFAFA] dark:bg-[#111111] z-40 px-6 py-6 shrink-0">
      
      {/* Editorial Logo */}
      <div className="mb-6 flex flex-col pl-1">
        <div className="flex items-center gap-1.5 mb-1.5 opacity-50">
          <ShieldAlert className="size-3 text-red-500" />
          <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-red-500">Admin Control</span>
        </div>
        <Link href="/admin/dashboard" className="flex items-center group w-fit">
          <span className="font-display-lg text-4xl font-light tracking-tighter text-primary">
            Closy<span className="text-red-500">.</span>
          </span>
        </Link>
      </div>

      {/* Elegant User Profile with Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-4 mb-6 p-3 rounded-2xl bg-muted/20 border border-border/30 backdrop-blur-sm transition-all hover:bg-muted/40 cursor-pointer group outline-none">
            {/* <div className="size-11 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:border-red-500/40 transition-colors">
              <ShieldAlert className="size-5 text-red-500" />
            </div> */}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-foreground truncate">
                {user?.name || "Administrator"}
              </span>
              <span className="text-[11px] font-medium text-red-500 uppercase tracking-widest mt-0.5">
                System Access
              </span>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px] rounded-2xl bg-background/95 backdrop-blur-xl border-border/40 p-2 shadow-xl">
          <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-muted/50 focus:bg-muted/50">
            <Link href="/" className="flex items-center gap-3 w-full text-foreground/80">
              <Sparkles className="size-4" />
              <span className="font-body-sm text-[13px] font-medium">Về trang User</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1 bg-border/40" />
          <DropdownMenuItem 
            onClick={handleLogout}
            className="rounded-xl px-3 py-2.5 cursor-pointer text-red-500/80 hover:text-red-500 hover:bg-red-500/10 focus:text-red-500 focus:bg-red-500/10"
          >
            <div className="flex items-center gap-3 w-full">
              <LogOutIcon className="size-4" />
              <span className="font-body-sm text-[13px] font-medium">Đăng xuất</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Main Navigation (Minimalist List) */}
      <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto custom-scrollbar pr-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative overflow-hidden",
                isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
            >
              {/* Active Indicator Line */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-red-500 rounded-r-full" />
              )}
              
              <Icon 
                className={cn(
                  "size-5 transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-red-500" : "text-muted-foreground group-hover:text-foreground"
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

    </aside>
  );
}
