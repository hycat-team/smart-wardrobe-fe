import { Metadata } from 'next';
import { BrandOrdersClient } from './components/BrandOrdersClient';

export const metadata: Metadata = {
  title: 'Đơn hàng | Brand Workspace',
};

export default function BrandOrdersPage() {
  return <BrandOrdersClient />;
}
