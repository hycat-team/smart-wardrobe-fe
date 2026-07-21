import { Metadata } from 'next';
import CustomersClient from './components/CustomersClient';

export const metadata: Metadata = {
  title: 'Quản lý khách hàng | Smart Wardrobe',
  description: 'Quản lý danh sách khách hàng của thương hiệu',
};

export default function CustomersPage() {
  return (
    <div className="w-full flex flex-col min-h-full">
      <div className="mb-6 px-6 lg:px-8 mt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">CRM Khách hàng</h1>
        <p className="text-muted-foreground mt-1">Quản lý hồ sơ, điểm thành viên và lịch sử mua hàng</p>
      </div>
      <CustomersClient />
    </div>
  );
}
