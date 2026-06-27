"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Package, LayoutDashboard, MessageSquareText, Settings, NotebookTabsIcon, Menu, X, Store, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`;
  };

  const NavLinks = () => (
    <>
      <Link href="/brand/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass('/brand/dashboard')}>
        <LayoutDashboard className="w-5 h-5" /> Bảng điều khiển
      </Link>
      <Link href="/brand/products" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass('/brand/products')}>
        <Package className="w-5 h-5" /> Sản phẩm
      </Link>
      <Link href="/brand/posts" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass('/brand/posts')}>
        <MessageSquareText className="w-5 h-5" /> Bài viết
      </Link>
      <Link href="/brand/customer-care" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass('/brand/customer-care')}>
        <MessageSquareText className="w-5 h-5" /> Chăm sóc khách hàng
      </Link>
      <Link href="/brand/digital-sample-lab/report" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass('/brand/digital-sample-lab/report')}>
        <NotebookTabsIcon className="w-5 h-5" /> Báo cáo thử mẫu
      </Link>
      <Link href="/brand/profile" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass('/brand/profile')}>
        <Store className="w-5 h-5" /> Hồ sơ thương hiệu
      </Link>
    </>
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-card flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="font-bold text-lg tracking-tight uppercase">Không gian<br /> thương hiệu</span>
        </div>
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-border">
          <Link href="/brands/brand_001" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-bold text-sm transition-colors text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" /> Về trang Shopper
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-card z-50 flex flex-col transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <span className="font-bold text-lg tracking-tight uppercase">Không gian <br /> thương hiệu</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 -mr-2">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-border">
          <Link href="/brands/brand_001" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-bold text-sm transition-colors text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" /> Về trang Shopper
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 -ml-2 text-foreground" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="font-bold text-sm text-muted-foreground uppercase tracking-widest hidden sm:block">Mori Studio</div>
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold ring-2 ring-transparent hover:ring-primary/50 transition-all focus:outline-none"
            >
              M
            </button>
            
            {isProfileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border shadow-lg rounded-2xl py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-border mb-1 bg-muted/30">
                    <p className="text-sm font-bold text-foreground line-clamp-1">Mori Studio</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Tài khoản Brand</p>
                  </div>
                  <div className="px-2 py-1 flex flex-col gap-1">
                    <Link href="/brand/profile" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-xl transition-colors font-medium">
                      <Store className="w-4 h-4 text-muted-foreground" /> Hồ sơ thương hiệu
                    </Link>
                    <Link href="/auth/login" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium">
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
