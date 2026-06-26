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
      {" "}
      {/* Header */}{" "}
      <div>
        {" "}
        <Link
          href="/brand/digital-sample-lab"
          className="text-[10px] font-sans text-ink-muted hover:text-ink flex items-center gap-1 mb-6 w-fit"
        >
          {" "}
          <ChevronLeft className="size-3" /> Quay lại Tạo Mẫu{" "}
        </Link>{" "}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-ink/10 pb-6">
          {" "}
          <div>
            {" "}
            <h1 className="text-4xl font-sans font-medium text-ink mb-2">My Sample Reports</h1>{" "}
            <p className="text-sm font-sans text-ink-muted border-l-2 border-[#A0522D] pl-3">
              {" "}
              Danh sách các chiến dịch thử nghiệm mẫu số{" "}
            </p>{" "}
          </div>{" "}
          <Link href="/brand/digital-sample-lab">
            {" "}
            <Button className="bg-ink text-cream hover:bg-ink/90 font-sans text-[11px] rounded-xl flex items-center gap-2">
              {" "}
              <Plus className="size-4" /> Khởi tạo mới{" "}
            </Button>{" "}
          </Link>{" "}
        </div>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {" "}
        {reports.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed border-ink/20 bg-[#F4F1EE]/50">
            {" "}
            <p className="text-sm font-sans text-ink-muted mb-4">Chưa có báo cáo nào</p>{" "}
            <Link href="/brand/digital-sample-lab">
              {" "}
              <Button variant="outline" className="font-sans text-[11px] rounded-xl border-ink/20">
                {" "}
                Tạo Digital Sample đầu tiên{" "}
              </Button>{" "}
            </Link>{" "}
          </div>
        ) : (
          reports.map((report) => (
            <Link key={report.id} href={`/brand/digital-sample-lab/report/${report.id}`}>
              {" "}
              <div className="bg-white p-6 border border-ink/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col group">
                {" "}
                <div className="flex-1">
                  {" "}
                  {report.imageUrl && (
                    <div className="w-[calc(100%+3rem)] h-48 -mx-6 -mt-6 mb-6 bg-ink/5 border-b border-ink/10 overflow-hidden relative">
                      {" "}
                      <img
                        src={report.imageUrl}
                        alt={report.productName}
                        className="w-full h-full object-cover"
                      />{" "}
                    </div>
                  )}{" "}
                  <div className="flex justify-between items-start mb-4">
                    {" "}
                    <h3 className="text-lg font-bold text-ink group-hover:text-[#A0522D] transition-colors">
                      {report.productName || "Unnamed Product"}
                    </h3>{" "}
                  </div>{" "}
                  <p className="text-sm text-ink-muted line-clamp-2 mb-4">{report.concept}</p>{" "}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {" "}
                    {report.variants?.map((v: any, i: number) => (
                      <div key={i} className="flex items-center gap-1.5 bg-[#F4F1EE] px-2 py-1">
                        {" "}
                        <div
                          className="w-2.5 h-2.5 rounded-full border border-ink/10"
                          style={{ backgroundColor: v.color || "#000" }}
                        />{" "}
                        <span className="text-[10px] font-sans ">{v.name}</span>{" "}
                      </div>
                    ))}{" "}
                  </div>{" "}
                </div>{" "}
                <div className="pt-4 border-t border-ink/10 flex items-center justify-between text-xs text-ink-muted font-sans mt-auto">
                  {" "}
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />{" "}
                    {new Date(report.createdAt).toLocaleDateString("vi-VN")}
                  </span>{" "}
                  <span className="text-[#A0522D] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Xem Report &rarr;
                  </span>{" "}
                </div>{" "}
              </div>{" "}
            </Link>
          ))
        )}{" "}
      </div>{" "}
    </div>
  );
}
