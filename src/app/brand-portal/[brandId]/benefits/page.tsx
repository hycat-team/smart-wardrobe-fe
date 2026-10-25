import { Metadata } from 'next';
import BenefitsClient from './components/BenefitsClient';

export const metadata: Metadata = {
  title: 'Quản lý quyền lợi & voucher | Smart Wardrobe',
  description: 'Quản lý voucher đổi bằng điểm và quyền lợi theo hạng thành viên',
};

export default function BenefitsPage() {
  return (
    <div className="w-full flex flex-col min-h-full">
      <div className="mb-6 px-6 lg:px-8 mt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Quyền lợi & Voucher</h1>
        <p className="text-muted-foreground mt-1">Tạo và quản lý voucher, quyền lợi dành cho khách hàng</p>
      </div>
      <BenefitsClient />
    </div>
  );
}
