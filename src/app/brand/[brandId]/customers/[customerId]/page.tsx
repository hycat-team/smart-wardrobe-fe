import { Metadata } from 'next';
import CustomerDetailClient from './components/CustomerDetailClient';

export const metadata: Metadata = {
  title: 'Chi tiết khách hàng | Smart Wardrobe',
  description: 'Hồ sơ chi tiết và lịch sử mua sắm của khách hàng',
};

export default function CustomerDetailPage() {
  return (
    <div className="w-full flex flex-col min-h-full">
      <CustomerDetailClient />
    </div>
  );
}
