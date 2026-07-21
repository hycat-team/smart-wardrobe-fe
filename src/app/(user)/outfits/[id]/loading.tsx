import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className="size-10 text-terracotta animate-spin" />
      <p className="text-sm text-ink-muted font-mono">Đang tải bộ phối đồ...</p>
    </div>
  );
}
