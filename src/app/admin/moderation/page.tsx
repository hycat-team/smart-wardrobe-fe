"use client";
import { useState } from "react";
import { Search, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MOCK_REPORTS = [
  {
    id: "r1",
    type: "marketplace", // marketplace, feed
    contentId: "m1",
    reporter: "user_789",
    reason: "Sản phẩm nghi ngờ hàng giả/nhái (Fake)",
    timestamp: "10 phút trước",
    status: "pending", // pending, approved, rejected
    content: {
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=200",
      title: "Áo Blazer Zara Nâu Đất",
      author: "lan_style"
    }
  },
  {
    id: "r2",
    type: "feed",
    contentId: "f4",
    reporter: "eco_warrior",
    reason: "Hình ảnh phản cảm/Không phù hợp",
    timestamp: "2 giờ trước",
    status: "pending",
    content: {
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200",
      title: "Outfit dạo phố cực cháy 🔥",
      author: "hot_girl_99"
    }
  },
  {
    id: "r3",
    type: "marketplace",
    contentId: "m5",
    reporter: "nguyen_a",
    reason: "Gian lận/Lừa đảo",
    timestamp: "5 giờ trước",
    status: "pending",
    content: {
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=200",
      title: "Túi Tote Canvas Basic",
      author: "eco_life"
    }
  }
];

export default function Moderation() {
  const [reports, setReports] = useState(MOCK_REPORTS);

  const handleAction = (id: string, action: "approve" | "reject") => {
    setReports(reports.map(r => r.id === id ? { ...r, status: action } : r));
  };

  const pendingCount = reports.filter(r => r.status === "pending").length;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground flex items-center gap-2">
            Hàng Đợi Kiểm Duyệt
            {pendingCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">Xử lý các báo cáo vi phạm từ cộng đồng để giữ nền tảng trong sạch.</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="border-border text-foreground">Lịch sử xử lý</Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Xử lý tự động AI</Button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
            Không có báo cáo nào cần xử lý.
          </div>
        ) : reports.map(report => (
          <div 
            key={report.id} 
            className={cn(
              "bg-card border rounded-xl p-4 md:p-6 transition-all duration-300 flex flex-col md:flex-row gap-6",
              report.status === "pending" ? "border-border shadow-sm" : "border-border/50 opacity-60 bg-muted/20"
            )}
          >
            {/* Content Preview */}
            <div className="flex gap-4 md:w-1/3 shrink-0">
              <div className="size-20 md:size-24 rounded-lg overflow-hidden bg-muted relative shrink-0">
                <img src={report.content.image} alt="Report content" className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                  {report.type}
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="font-medium text-sm md:text-base text-foreground line-clamp-2">{report.content.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">Đăng bởi <span className="font-medium text-foreground">@{report.content.author}</span></p>
                <button className="text-xs text-primary hover:underline flex items-center gap-1 mt-2 w-fit">
                  Xem chi tiết <ExternalLink className="size-3" />
                </button>
              </div>
            </div>

            {/* Divider on desktop */}
            <div className="hidden md:block w-px bg-border my-2" />

            {/* Report Details & Actions */}
            <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-orange-500" />
                  <span className="text-sm font-bold text-orange-500">{report.reason}</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Người báo cáo: <span className="font-mono text-foreground">@{report.reporter}</span></p>
                  <p>Thời gian: {report.timestamp}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-row md:flex-col justify-end gap-2 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-border">
                {report.status === "pending" ? (
                  <>
                    <Button 
                      onClick={() => handleAction(report.id, "reject")}
                      variant="outline" 
                      className="border-green-500/30 text-green-500 hover:bg-green-500/10 hover:text-green-600 flex-1 md:flex-none justify-start"
                    >
                      <CheckCircle2 className="size-4 mr-2" /> Bỏ qua (An toàn)
                    </Button>
                    <Button 
                      onClick={() => handleAction(report.id, "approve")}
                      variant="outline" 
                      className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-600 flex-1 md:flex-none justify-start"
                    >
                      <XCircle className="size-4 mr-2" /> Xóa nội dung
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 h-full justify-center md:justify-end px-4">
                    <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      {report.status === "approve" ? "Đã Xóa" : "Đã Bỏ Qua"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


