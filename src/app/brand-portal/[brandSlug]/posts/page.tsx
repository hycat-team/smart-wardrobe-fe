import { Metadata } from 'next';
import { BrandPostsClient } from './components/BrandPostsClient';

export const metadata: Metadata = {
  title: 'Quản lý Bài viết | Brand Workspace',
};

export default function BrandPostsPage() {
  return <BrandPostsClient />;
}
