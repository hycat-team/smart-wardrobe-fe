import { Metadata } from 'next';
import LoyaltyClient from './components/LoyaltyClient';

export const metadata: Metadata = {
  title: 'Loyalty & Quyền lợi | Closy',
  description: 'Cấu hình chương trình điểm, hạng thành viên và quyền lợi/voucher của thương hiệu',
};

export default function LoyaltyPage() {
  return (
    <div className="w-full flex flex-col min-h-full">
      <div className="mb-2 px-6 lg:px-8 mt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Loyalty & Quyền lợi</h1>
        <p className="text-muted-foreground mt-1">Quản lý chương trình khách hàng thân thiết, hạng thành viên và quyền lợi/voucher</p>
      </div>
      <LoyaltyClient />
    </div>
  );
}
