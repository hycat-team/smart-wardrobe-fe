import { Metadata } from 'next';
import BenefitsClient from './components/BenefitsClient';

export const metadata: Metadata = {
  title: 'Quản lý phúc lợi | Smart Wardrobe',
  description: 'Quản lý các loại phúc lợi, đổi điểm và đặc quyền thành viên',
};

export default function BenefitsPage() {
  return (
    <div className="w-full flex flex-col min-h-full">
      <div className="mb-6 px-6 lg:px-8 mt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Phúc lợi</h1>
        <p className="text-muted-foreground mt-1">Tạo và quản lý các loại phúc lợi dành cho khách hàng</p>
      </div>
      <BenefitsClient />
    </div>
  );
}
