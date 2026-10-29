"use client";
import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, ChevronLeft, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetBrandPortalItems } from "@/features/brands/queries/user-brands.queries";
import { useBrandItemSSE } from "@/features/brand-portal/hooks/useBrandItemSSE";
import { BrandItemMetaChips } from "@/features/brand-portal/components/BrandItemMeta";
import { getItemDisplayStatus } from "@/features/brand-portal/utils/item-status";
import { brandPortalPath } from "@/features/brand-portal/utils/routes";

export function ReportListClient() {
  const params = useParams();
  const brandId = params.brandSlug as string;

  const { data: reports, isLoading, refetch } = useGetBrandPortalItems(brandId, 'sample');

  useBrandItemSSE(brandId, reports ?? [], () => { void refetch(); });

  const sortedReports = useMemo(() => {
    const items = reports ?? [];
    return [...items].sort((a, b) => {
      const left = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const right = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return right - left;
    });
  }, [reports]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-10">
      {/* Header */}
      <div>
        <Link href={brandPortalPath(brandId, 'digital-sample-lab')} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6 w-fit">
          <ChevronLeft className="size-3" /> Quay lại Tạo Mẫu
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
          <div>
            <p className="text-sm tracking-widest uppercase text-muted-foreground border-l-2 border-primary pl-3">
              Danh sách các chiến dịch thử nghiệm mẫu sợi
            </p>
          </div>
          <Link href={brandPortalPath(brandId, 'digital-sample-lab')}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-[11px] uppercase tracking-widest rounded-full flex items-center gap-2">
              <Plus className="size-4" /> Khởi tạo mới
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedReports.length === 0 ? (
            <div className="col-span-full py-12 text-center border border-dashed border-border bg-muted/50 rounded-3xl">
              <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">Chưa có báo cáo nào</p>
              <Link href={brandPortalPath(brandId, 'digital-sample-lab')}>
                <Button variant="outline" className="font-bold text-[11px] uppercase tracking-widest rounded-full border-border">
                  Tạo Digital Sample đầu tiên
                </Button>
              </Link>
            </div>
          ) : (
            sortedReports.map((report) => {
              const imageUrl = report.fashionItem?.imageUrl;
              const status = getItemDisplayStatus(report);
              return (
                <Link
                  key={report.id}
                  href={`${brandPortalPath(brandId, 'digital-sample-lab/report')}/${report.id}`}
                >
                  <div className="bg-card p-6 border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col group rounded-3xl">
                    <div className="flex-1">
                      {imageUrl ? (
                        <div className="w-[calc(100%+3rem)] h-48 -mx-6 -mt-6 mb-6 bg-muted border-b border-border overflow-hidden relative rounded-t-3xl">
                          <img src={imageUrl} alt={report.name || 'Mẫu thử'} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-[calc(100%+3rem)] h-48 -mx-6 -mt-6 mb-6 bg-muted border-b border-border rounded-t-3xl flex items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
                          Chưa có ảnh
                        </div>
                      )}
                      <div className="flex justify-between items-start gap-3 mb-3">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {report.name || 'Mẫu chưa đặt tên'}
                        </h3>
                        {status === 'analyzing' && (
                          <span className="shrink-0 rounded-full bg-blue-500/15 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-blue-600">
                            Đang phân tích
                          </span>
                        )}
                        {status === 'failed' && (
                          <span className="shrink-0 rounded-full bg-destructive/15 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-destructive">
                            Thất bại
                          </span>
                        )}
                      </div>
                      {report.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{report.description}</p>
                      )}
                      <div className="mb-6">
                        <BrandItemMetaChips item={report} />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-widest mt-auto">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {report.createdAt ? new Date(report.createdAt).toLocaleDateString('vi-VN') : '—'}
                      </span>
                      <span className="text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Xem Report &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
