'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UsersIcon, MessageSquareIcon, GridIcon, LayoutDashboardIcon, LogOutIcon, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { href: '/admin/users', label: 'Người dùng', icon: UsersIcon },
  { href: '/admin/moderation', label: 'Kiểm duyệt', icon: MessageSquareIcon },
  { href: '/admin/catalog', label: 'Catalog Hệ thống', icon: GridIcon },
  { href: '/admin/trends', label: 'Xu hướng', icon: TrendingUp },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 bg-card border-r min-h-screen shrink-0">
      <div className="h-16 border-b flex items-center px-6 sticky top-0 bg-card z-10">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="size-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <span className="font-bold text-xl tracking-tight">SmartWardrobe</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm',
                isActive 
                  ? 'bg-secondary text-secondary-foreground font-medium' 
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t mt-auto">
        <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start")}>
          <LogOutIcon data-icon="inline-start" className="size-4 text-muted-foreground" />
          <span className="ml-2">Về trang chủ</span>
        </Link>
      </div>
    </aside>
  );
}
