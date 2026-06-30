import { Metadata } from 'next';
import LoyaltyClient from './components/LoyaltyClient';

export const metadata: Metadata = {
  title: 'Chương trình điểm thưởng | Smart Wardrobe',
  description: 'Cấu hình chương trình điểm thưởng và các hạng thành viên',
};

export default function LoyaltyPage() {
  return (
    <div className="w-full flex flex-col min-h-full">
      <div className="mb-6 px-6 lg:px-8 mt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Chương trình điểm</h1>
        <p className="text-muted-foreground mt-1">Quản lý chương trình khách hàng thân thiết và các hạng thành viên</p>
      </div>
      <LoyaltyClient />
    </div>
  );
}
