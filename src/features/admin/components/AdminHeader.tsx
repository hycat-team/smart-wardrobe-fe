import { Sparkles } from 'lucide-react';

export function AdminHeader() {
  return (
    <header className="h-16 border-b border-black/10 bg-white flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-3">
        <Sparkles className="size-4 text-[#A3A3A3]" />
        <h1 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#111] font-bold">
          Bảng điều khiển hệ thống
        </h1>
      </div>

      <div className="flex items-center gap-4 text-[#666] font-semibold text-[10px] uppercase tracking-widest">
        <span>Trạng thái: <span className="text-[#111] font-bold">Đang hoạt động</span></span>
      </div>
    </header>
  );
}
