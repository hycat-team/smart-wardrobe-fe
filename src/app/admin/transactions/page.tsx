import { Metadata } from 'next';
import { TransactionsClient } from './components/TransactionsClient';

export const metadata: Metadata = {
  title: 'Giao Dịch PayOS & Đối Soát | Closy Admin',
  description: 'Giám sát và xử lý đối soát giao dịch thanh toán PayOS.',
};

export default function AdminTransactionsPage() {
  return <TransactionsClient />;
}
