import { Metadata } from 'next';
import ChatInboxClient from './components/ChatInboxClient';

export const metadata: Metadata = {
  title: 'Chat Inbox | Smart Wardrobe',
  description: 'Chăm sóc và hỗ trợ khách hàng',
};

export default function ChatInboxPage() {
  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-8rem)]">
      <ChatInboxClient />
    </div>
  );
}
