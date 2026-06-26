import { Metadata } from 'next';
import CartClient from './components/CartClient';

export const metadata: Metadata = {
  title: 'Giỏ hàng | Smart Wardrobe',
  description: 'Giỏ hàng của bạn',
};

export default function CartPage() {
  return <CartClient />;
}
