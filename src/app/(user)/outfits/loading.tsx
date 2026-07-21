export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6 pt-24">
      <div className="size-16 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
      <p className="text-xs text-ink-muted font-mono tracking-widest uppercase">Đang tải lookbook...</p>
    </div>
  );
}
