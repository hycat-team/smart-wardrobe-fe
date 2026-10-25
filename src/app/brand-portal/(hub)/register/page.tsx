import { Metadata } from 'next';
import BrandRegistrationClient from './components/BrandRegistrationClient';

export const metadata: Metadata = {
  title: 'Đăng ký thương hiệu mới | Smart Wardrobe',
  description: 'Gửi yêu cầu đăng ký tạo không gian thương hiệu mới',
};

export default function BrandRegistrationPage() {
  return (
    <div className="flex-1 bg-muted/20 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="w-full max-w-2xl mx-auto">
        <BrandRegistrationClient />
      </div>
    </div>
  );
}
