import { Metadata } from 'next';
import { BrandUsersClient } from './components/BrandUsersClient';

export const metadata: Metadata = {
  title: 'Khách hàng | Brand Workspace',
};

export default function BrandUsersPage() {
  return <BrandUsersClient />;
}
