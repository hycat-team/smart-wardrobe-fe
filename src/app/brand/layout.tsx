"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Package, LayoutDashboard, MessageSquareText, Settings, NotebookTabsIcon, Menu, X, Store, LogOut, ChevronRight, Users, ShoppingCart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_ITEMS = [
  { href: '/brand/dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
  { href: '/brand/products', label: 'Sản phẩm', icon: Package },
  { href: '/brand/posts', label: 'Bài viết', icon: MessageSquareText },

  { href: '/brand/orders', label: 'Đơn hàng', icon: ShoppingCart },
  { href: '/brand/users', label: 'Khách hàng', icon: Users },
  { href: '/brand/customer-care', label: 'Chăm sóc khách hàng', icon: MessageSquareText },

  { href: '/brand/digital-sample-lab/report', label: 'Báo cáo thử mẫu', icon: NotebookTabsIcon },
  { href: '/brand/profile', label: 'Hồ sơ thương hiệu', icon: Store },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
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

function ProfileMenu({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 p-3 bg-muted/30 border border-border hover:border-primary transition-all cursor-pointer group outline-none shadow-sm rounded-xl">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">M</div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-bold text-sm text-foreground truncate">Mori Studio</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">Brand</span>
          </div>
          <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-[240px] rounded-2xl border border-border bg-card p-2 shadow-xl mb-2">
        <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-muted focus:bg-muted">
          <Link href="/brand/profile" className="flex items-center gap-3 w-full text-foreground" onClick={onNavigate}>
            <Store className="size-4 text-muted-foreground" />
            <span className="font-semibold text-[11px] uppercase tracking-widest">Hồ sơ thương hiệu</span>
          </Link>
        </DropdownMenuItem>
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

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-card flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="font-bold text-lg tracking-tight uppercase">Không gian<br /> thương hiệu</span>
        </div>
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
          <SidebarNav />
        </nav>
        <div className="p-4 border-t border-border flex flex-col gap-3">
          <Link href="/brands/brand_001" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-bold text-sm transition-colors text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" /> Về trang Shopper
          </Link>
          <ProfileMenu />
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
          <button onClick={closeMobileMenu} className="p-1 -mr-2">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
          <SidebarNav onNavigate={closeMobileMenu} />
        </nav>
        <div className="p-4 border-t border-border flex flex-col gap-3">
          <Link href="/brands/brand_001" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-bold text-sm transition-colors text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" /> Về trang Shopper
          </Link>
          <ProfileMenu onNavigate={closeMobileMenu} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="h-16 border-b border-border bg-card flex items-center px-4 lg:px-8 shrink-0">
          <button className="lg:hidden p-2 -ml-2 text-foreground mr-4" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-bold text-sm text-muted-foreground uppercase tracking-widest">Mori Studio</div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
