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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { useLogout } from '@/features/auth/queries/auth.queries';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { href: '/admin/users', label: 'Người dùng', icon: UsersIcon },
  { href: '/admin/moderation', label: 'Kiểm duyệt', icon: MessageSquareIcon },
  { href: '/admin/wardrobe', label: 'Trang phục', icon: GridIcon },
  { href: '/admin/category', label: 'Danh mục', icon: GridIcon },
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
    <aside className="hidden md:flex flex-col w-[280px] border-r border-border h-dvh sticky top-0 bg-card z-40 px-6 py-6 shrink-0 text-foreground">

      {/* Editorial Logo */}
      <div className="mb-8 flex flex-col pl-1">
        <div className="flex items-center gap-1.5 mb-1.5">
          <ShieldAlert className="size-3 text-primary" />
          <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-primary">System Admin</span>
        </div>
        <Link href="/admin/dashboard" className="flex items-center group w-fit">
          <span className="font-semibold text-4xl text-foreground tracking-tighter">
            Closy<span className="text-primary">.</span>
          </span>
        </Link>
      </div>

      {/* Elegant User Profile with Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-4 mb-8 p-3 bg-muted/50 border border-border hover:border-primary transition-all cursor-pointer group outline-none shadow-sm rounded-2xl">
            <div className="flex flex-col flex-1 min-w-0 pl-1">
              <span className="font-semibold text-lg text-foreground truncate">
                {user?.name || "Administrator"}
              </span>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px] rounded-2xl border border-border bg-card p-2 shadow-xl">
          <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-muted focus:bg-muted">
            <Link href="/" className="flex items-center gap-3 w-full text-foreground">
              <Sparkles className="size-4" />
              <span className="font-semibold text-[11px] uppercase tracking-widest">Về trang User</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1 bg-border" />
          <DropdownMenuItem
            onClick={handleLogout}
            className="rounded-xl px-3 py-2.5 cursor-pointer text-foreground hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground transition-colors"
          >
            <div className="flex items-center gap-3 w-full">
              <LogOutIcon className="size-4" />
              <span className="font-semibold text-[11px] uppercase tracking-widest">Đăng xuất</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Main Navigation (Minimalist List) */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-4 px-4 py-3 transition-all relative overflow-hidden rounded-xl",
                isActive ? "text-primary-foreground bg-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "size-[18px] transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className={cn(
                "font-semibold text-[11px] uppercase tracking-widest",
                isActive ? "" : ""
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
