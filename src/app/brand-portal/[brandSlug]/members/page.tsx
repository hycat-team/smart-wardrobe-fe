import { Metadata } from 'next';
import MembersClient from './components/MembersClient';

export const metadata: Metadata = {
  title: 'Quản lý thành viên | Smart Wardrobe',
  description: 'Quản lý nhân sự và phân quyền thương hiệu',
};

export default function MembersPage() {
  return (
    <div className="w-full flex flex-col min-h-full">
      <div className="mb-6 px-6 lg:px-8 mt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Thành viên</h1>
        <p className="text-muted-foreground mt-1">Quản lý danh sách nhân sự vận hành thương hiệu của bạn</p>
      </div>
      <MembersClient />
    </div>
  );
}
