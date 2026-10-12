import { Metadata } from 'next';
import { Suspense } from 'react';
import { PaymentResultClient } from './components/PaymentResultClient';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kết quả thanh toán | Smart Wardrobe',
  description: 'Trạng thái xử lý thanh toán giao dịch Smart Wardrobe.',
};

function PaymentResultLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium">Đang tải kết quả giao dịch...</p>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<PaymentResultLoading />}>
      <PaymentResultClient />
    </Suspense>
  );
}
