export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-slate-50 rounded-lg">
        <h1 className="text-4xl font-extrabold mb-4">Chào mừng đến với Diễn Đàn</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Nơi giao lưu, chia sẻ kiến thức và cập nhật những thông tin mới nhất.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Bài viết mới nhất</h2>
        <div className="grid gap-4">
          {/* Mockup Data */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Tiêu đề bài viết {i}</h3>
              <p className="text-slate-600 mb-4">Đây là đoạn mô tả ngắn về nội dung bài viết, giúp người đọc nắm bắt ý chính trước khi nhấn vào xem chi tiết.</p>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Tác giả: Admin</span>
                <span>Ngày đăng: 27/05/2026</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
