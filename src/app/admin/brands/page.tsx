import { Metadata } from 'next';
import AdminBrandApprovalClient from './components/AdminBrandApprovalClient';

export const metadata: Metadata = {
  title: 'Quản lý Thương hiệu - Admin Portal | Closy',
  description: 'Quản trị viên xét duyệt các yêu cầu đăng ký thương hiệu',
};

export default function AdminBrandsPage() {
  return <AdminBrandApprovalClient />;
}
