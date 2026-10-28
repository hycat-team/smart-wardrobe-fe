import { Skeleton } from '@/components/ui/skeleton';

export function BrandDashboardSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 pb-24"
      aria-label="Đang tải Brand Dashboard"
    >
      <div className="flex flex-col gap-5 border-b border-border pb-6 pt-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-12 w-72 rounded-2xl" />
          <Skeleton className="h-4 w-full max-w-lg rounded-full" />
          <Skeleton className="h-4 w-56 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-11 w-64 rounded-full" />
          <Skeleton className="h-11 w-28 rounded-full" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-40 rounded-3xl" />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Skeleton className="h-[440px] rounded-3xl xl:col-span-2" />
        <Skeleton className="h-[440px] rounded-3xl" />
      </div>

      <Skeleton className="h-[430px] rounded-3xl" />
      <Skeleton className="h-[420px] rounded-3xl" />
    </div>
  );
}
