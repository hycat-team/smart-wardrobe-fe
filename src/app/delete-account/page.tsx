import type { Metadata } from 'next';
import { DeleteAccountClient } from './components/DeleteAccountClient';

// Trang công khai — không yêu cầu đăng nhập (middleware không redirect).
// URL dùng cho Google Play Console / Store listing (Account Deletion Requirement):
// https://closy.hycat.online/delete-account
// Mục đích: Tuân thủ chính sách "Request account and data deletion" của Google Play Store (CH Play)
export const metadata: Metadata = {
  title: 'Yêu cầu xóa tài khoản & dữ liệu | Closy (Smart Wardrobe)',
  description:
    'Hướng dẫn gửi yêu cầu xóa tài khoản và dữ liệu cá nhân ứng dụng Closy (Smart Wardrobe) qua email hycat.support@gmail.com theo quy định bảo mật dữ liệu Google Play Store.',
  openGraph: {
    title: 'Yêu cầu xóa tài khoản & dữ liệu | Closy (Smart Wardrobe)',
    description:
      'Quy trình và định dạng viết mail gửi yêu cầu xóa tài khoản Closy tới hycat.support@gmail.com.',
    type: 'website',
  },
};

export default function DeleteAccountPage() {
  return <DeleteAccountClient />;
}
