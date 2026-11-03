import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { StyleProfileClient } from './components/StyleProfileClient';

export const metadata: Metadata = {
  title: 'Gu của tôi | Smart Wardrobe',
  description: 'Hồ sơ gu cá nhân: phong cách bạn mặc, phong cách bạn muốn tránh và gợi ý từ tủ đồ.',
};

export default function StyleProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <StyleProfileClient />
    </Suspense>
  );
}
