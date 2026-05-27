import Link from 'next/link';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">Diễn Đàn</Link>
          <nav className="space-x-4">
            <Link href="/" className="hover:text-primary">Trang chủ</Link>
            <Link href="/forum" className="hover:text-primary">Thảo luận</Link>
            <Link href="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Đăng nhập</Link>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-slate-50 p-6 text-center text-slate-500 mt-auto">
        <p>&copy; {new Date().getFullYear()} Diễn đàn. All rights reserved.</p>
      </footer>
    </div>
  );
}
