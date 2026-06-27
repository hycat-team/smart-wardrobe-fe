"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ChevronLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReportListClient() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    try {
      const existingStr = localStorage.getItem("digital_sample_lab_reports");
      if (existingStr) {
        setReports(JSON.parse(existingStr).reverse());
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-10">
      {/* Header */}
      <div>
        <Link href="/brand/digital-sample-lab" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6 w-fit">
          <ChevronLeft className="size-3" /> Quay lại Tạo Mẫu
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
          <div>
            {/* <h1 className="text-4xl font-bold uppercase tracking-tight text-foreground mb-2">My Sample Reports</h1> */}
            <p className="text-sm tracking-widest uppercase text-muted-foreground border-l-2 border-primary pl-3">
              Danh sách các chiến dịch thử nghiệm mẫu số
            </p>
          </div>
          <Link href="/brand/digital-sample-lab">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-[11px] uppercase tracking-widest rounded-full flex items-center gap-2">
              <Plus className="size-4" /> Khởi tạo mới
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed border-border bg-muted/50 rounded-3xl">
            <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">Chưa có báo cáo nào</p>
            <Link href="/brand/digital-sample-lab">
              <Button variant="outline" className="font-bold text-[11px] uppercase tracking-widest rounded-full border-border">
                Tạo Digital Sample đầu tiên
              </Button>
            </Link>
          </div>
        ) : (
          reports.map((report) => (
            <Link key={report.id} href={`/brand/digital-sample-lab/report/${report.id}`}>
              <div className="bg-card p-6 border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col group rounded-3xl">
                <div className="flex-1">
                  {report.imageUrl && (
                    <div className="w-[calc(100%+3rem)] h-48 -mx-6 -mt-6 mb-6 bg-muted border-b border-border overflow-hidden relative rounded-t-3xl">
                      <img src={report.imageUrl} alt={report.productName} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{report.productName || "Unnamed Product"}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{report.concept}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {report.variants?.map((v: any, i: number) => (
                      <div key={i} className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-full">
                        <div className="w-2.5 h-2.5 rounded-full border border-border" style={{ backgroundColor: v.color || '#000' }} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{v.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-widest mt-auto">
                  <span className="flex items-center gap-1"><Calendar className="size-3" /> {new Date(report.createdAt).toLocaleDateString('vi-VN')}</span>
                  <span className="text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">Xem Report &rarr;</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
