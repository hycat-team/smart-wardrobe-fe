import { Metadata } from 'next';
import { Suspense } from 'react';
import { ProfileData } from './components/ProfileData';
import Loading from './loading';

export const metadata: Metadata = {
  title: 'Hồ sơ cá nhân | Smart Wardrobe',
  description: 'Quản lý hồ sơ cá nhân và phân tích phong cách thời trang của bạn.',
};

export default function UserProfilePage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileData />
    </Suspense>
  );
}
