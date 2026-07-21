import { Suspense } from 'react';
import WardrobeData from './components/WardrobeData';
import Loading from './loading';

export default function WardrobePage() {
  return (
    <Suspense fallback={<Loading />}>
      <WardrobeData />
    </Suspense>
  );
}
