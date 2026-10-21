import { Metadata } from 'next';
import { CommunityAdminClient } from './components/CommunityAdminClient';

export const metadata: Metadata = {
  title: 'Quản trị Cộng đồng | Smart Wardrobe Admin',
  description: 'Bảng điều khiển và kiểm duyệt nội dung bài đăng, bình luận cộng đồng Closy.',
};

export default function CommunityAdminPage() {
  return <CommunityAdminClient />;
}
