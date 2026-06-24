import React from 'react';
import Link from 'next/link';
import { Package, LayoutDashboard, MessageSquareText, Settings } from 'lucide-react';

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#FAFAFA] text-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-black/10 bg-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-black/10">
          <span className="font-bold text-lg tracking-tight uppercase">Brand Workspace</span>
        </div>
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
          <Link href="/brand/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-black/5 font-bold text-sm transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/brand/products" className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-black/5 font-bold text-sm transition-colors">
            <Package className="w-5 h-5" /> Sản phẩm
          </Link>
          <Link href="/brand/customer-care" className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-black/5 font-bold text-sm transition-colors">
            <MessageSquareText className="w-5 h-5" /> Chăm sóc khách hàng
          </Link>
        </nav>
        <div className="p-4 border-t border-black/10">
          <Link href="/community" className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-black/5 font-bold text-sm transition-colors text-black/50">
            <Settings className="w-5 h-5" /> Về trang Shopper
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="h-16 border-b border-black/10 bg-white flex items-center justify-between px-8">
          <div className="font-bold text-sm text-black/50 uppercase tracking-widest">Mori Studio</div>
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">M</div>
        </div>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
