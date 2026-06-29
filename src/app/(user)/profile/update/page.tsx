import { Metadata } from 'next';
import { Suspense } from 'react';
import { ProfileUpdateData } from './components/ProfileUpdateData';
import Loading from './loading';

export const metadata: Metadata = {
  title: 'Cập nhật hồ sơ | Smart Wardrobe',
  description: 'Cập nhật thông tin hồ sơ cá nhân.',
};

export default function ProfileUpdatePage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileUpdateData />
    </Suspense>
  );
}
