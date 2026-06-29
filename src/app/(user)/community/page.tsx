import { Suspense } from 'react';
import { CommunityData } from './components/CommunityData';
import Loading from './loading';

export const metadata = {
  title: 'Community | Smart Wardrobe',
  description: 'Inspiration from conscious creators.',
};

export default function CommunityPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CommunityData />
    </Suspense>
  );
}
