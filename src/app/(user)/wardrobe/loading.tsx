// import { Loader2 } from 'lucide-react';

// export default function Loading() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
//       <Loader2 className="size-10 text-primary animate-spin" />
//       <p className="text-sm text-muted-foreground font-mono">Đang tải tủ đồ...</p>
//     </div>
//   );
// }
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6 pt-24">
      <div className="size-16 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
      <p className="text-xs text-ink-muted font-mono tracking-widest uppercase">Đang tải tủ đồ...</p>
    </div>
  );
}
