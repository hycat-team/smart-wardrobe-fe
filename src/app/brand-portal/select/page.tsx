import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BrandSwitcherClient from './components/BrandSwitcherClient';

export const metadata: Metadata = {
  title: 'Chọn Thương Hiệu | Smart Wardrobe',
  description: 'Chọn thương hiệu để quản lý',
};

export default function BrandSwitcherPage() {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-background/50 hover:bg-background px-4 py-2 rounded-full border border-border shadow-sm backdrop-blur-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Trở về trang chủ</span>
        </Link>
      </div>
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Không Gian Thương Hiệu</h1>
          <p className="text-muted-foreground mt-2">Vui lòng chọn một thương hiệu để tiếp tục</p>
        </div>
        <BrandSwitcherClient />
      </div>
    </div>
  );
}
