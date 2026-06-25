"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Package, LayoutDashboard, MessageSquareText, Settings, NotebookTabsIcon, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-3 px-4 py-3 rounded-sm font-bold text-sm transition-colors ${isActive ? 'bg-black text-white' : 'hover:bg-black/5 text-black'}`;
  };

  const NavLinks = () => (
    <>
      <Link href="/brand/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass('/brand/dashboard')}>
        <LayoutDashboard className="w-5 h-5" /> Dashboard
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
    </>
  );

  return (
    <div className="flex h-screen bg-[#FAFAFA] text-black overflow-hidden relative">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-black/10 bg-white flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-black/10">
          <span className="font-bold text-lg tracking-tight uppercase">Brand Workspace</span>
        </div>
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-black/10">
          <Link href="/brands/brand_001" className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-black/5 font-bold text-sm transition-colors text-black/50">
            <Settings className="w-5 h-5" /> Về trang Shopper
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-black/10">
          <span className="font-bold text-lg tracking-tight uppercase">Brand Workspace</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 -mr-2">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-black/10">
          <Link href="/brands/brand_001" className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-black/5 font-bold text-sm transition-colors text-black/50">
            <Settings className="w-5 h-5" /> Về trang Shopper
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="h-16 border-b border-black/10 bg-white flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 -ml-2" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="font-bold text-sm text-black/50 uppercase tracking-widest hidden sm:block">Mori Studio</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">M</div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
