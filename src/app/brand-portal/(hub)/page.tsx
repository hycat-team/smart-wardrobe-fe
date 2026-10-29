import { Metadata } from 'next';
import BrandHubClient from '@/app/brand-portal/components/BrandHubClient';

export const metadata: Metadata = {
  title: 'Quản lý thương hiệu | Smart Wardrobe',
  description: 'Chọn hoặc tạo thương hiệu để quản lý.',
};

export default function BrandHubPage() {
  return (
    <div className="flex-1 bg-muted/20 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="w-full max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Quản lý thương hiệu</h1>
          <p className="text-muted-foreground mt-2">
            Chọn một thương hiệu để tiếp tục quản lý hoặc đăng ký thương hiệu mới.
          </p>
        </div>
        <BrandHubClient />
      </div>
    </div>
  );
}
