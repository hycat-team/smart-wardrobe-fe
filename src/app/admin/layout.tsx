export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar giả định */}
      <aside className="w-64 bg-slate-900 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2"><a href="/dashboard" className="hover:underline">Dashboard</a></li>
            <li className="mb-2"><a href="/users" className="hover:underline">Quản lý người dùng</a></li>
            <li className="mb-2"><a href="/posts" className="hover:underline">Quản lý bài viết</a></li>
          </ul>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

