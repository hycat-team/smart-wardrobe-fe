import { Metadata } from 'next';
import { ActivityEventsClient } from './components/ActivityEventsClient';

export const metadata: Metadata = {
  title: 'Nhật Ký Hoạt Động Người Dùng | Closy Admin',
  description: 'Truy vết và giám sát nhật ký đăng nhập, làm mới phiên xác thực người dùng.',
};

export default function AdminActivityEventsPage() {
  return <ActivityEventsClient />;
}
