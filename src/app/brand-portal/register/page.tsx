import { Metadata } from 'next';
import BrandRegistrationClient from './components/BrandRegistrationClient';

export const metadata: Metadata = {
  title: 'Đăng ký thương hiệu mới | Smart Wardrobe',
  description: 'Gửi yêu cầu đăng ký tạo không gian thương hiệu mới',
};

export default function BrandRegistrationPage() {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <BrandRegistrationClient />
      </div>
    </div>
  );
}
