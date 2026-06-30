import { Metadata } from 'next';
import BrandsClient from './components/BrandsClient';

export const metadata: Metadata = {
  title: 'Thương Hiệu | Closy',
  description: 'Khám phá các nhãn hàng nội địa chất lượng cao trên Closy.',
};

export default function BrandsPage() {
  return <BrandsClient />;
}
