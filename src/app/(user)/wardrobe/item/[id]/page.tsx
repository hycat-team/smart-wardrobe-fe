"use client";

import { useParams, useRouter } from "next/navigation";
import { useWardrobeItemDetail, useDeleteWardrobeItem } from "@/features/wardrobe/queries/wardrobe.queries";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2, Loader2, Tag, Info, AlertCircle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { WardrobeItemStatus } from "@/features/wardrobe/types";

// Helper to normalize color to HEX (can be extracted to common utility later)
const COLORS = [
  { name: "Trắng", value: "white", hex: "#FFFFFF" },
  { name: "Đen", value: "black", hex: "#1A1A1A" },
  { name: "Xanh dương", value: "blue", hex: "#2563EB" },
  { name: "Xám", value: "gray", hex: "#9CA3AF" },
  { name: "Đỏ", value: "red", hex: "#DC2626" },
  { name: "Vàng", value: "yellow", hex: "#F59E0B" },
  { name: "Be", value: "beige", hex: "#F5F5DC" },
];

function getColorHex(colorName?: string): string {
  if (!colorName) return "#CCCCCC";
  const c = COLORS.find(x => x.name.toLowerCase() === colorName.toLowerCase() || x.value === colorName.toLowerCase());
  return c ? c.hex : "#CCCCCC";
}

export default function WardrobeItemDetail() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;
  const user = useAuthStore((state) => state.user);
  const isPremium = user?.isPremium;

  const { data: item, isLoading, error } = useWardrobeItemDetail(itemId);
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteWardrobeItem();

  const handleDelete = () => {
    deleteItem(itemId, {
      onSuccess: () => {
        router.push("/wardrobe");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="size-8 animate-spin text-terracotta" />
        <p className="text-sm font-mono text-ink-muted animate-pulse">Đang tải thông tin trang phục...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center max-w-md mx-auto">
        <AlertCircle className="size-12 text-red-500/80" />
        <h2 className="text-xl font-heading font-semibold text-ink">Không tìm thấy trang phục</h2>
        <p className="text-sm text-ink-muted">Trang phục này có thể đã bị xóa hoặc không tồn tại. Vui lòng kiểm tra lại.</p>
        <Button onClick={() => router.push("/wardrobe")} variant="outline" className="mt-4 rounded-xl font-mono">
          QUAY LẠI TỦ ĐỒ
        </Button>
      </div>
    );
  }

  const isProcessing = item.status === WardrobeItemStatus.Processing;
  const isFailed = item.status === WardrobeItemStatus.Failed;
  
  const itemName = item.category?.name 
    ? `${item.category.name} ${item.color || ""} ${item.style || ""}`.trim()
    : "Trang phục chưa phân loại";

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 pb-20">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => router.push("/wardrobe")}
          className="flex items-center gap-2 text-sm font-mono text-ink-muted hover:text-ink transition-colors group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" /> 
          QUAY LẠI
        </button>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => router.push(`/wardrobe/item/${itemId}/edit`)}
            className="rounded-xl h-9 px-4 text-xs font-mono font-medium bg-ink text-cream hover:bg-ink/90 shadow-sm"
          >
            <Edit2 className="size-3.5 mr-2" /> CHỈNH SỬA
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline"
                className="rounded-xl h-9 px-3 text-xs font-mono font-medium border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 shadow-sm transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl border-cream-dark">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-heading text-xl text-ink">Xóa trang phục này?</AlertDialogTitle>
                <AlertDialogDescription className="font-sans text-ink-muted">
                  Bạn có chắc chắn muốn xóa trang phục này khỏi tủ đồ không? Nếu trang phục này đang được sử dụng trong các bộ phối đồ (Outfit), nó có thể bị mất hiển thị. Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel className="rounded-xl font-mono text-sm border-cream-dark">HỦY BỎ</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="rounded-xl font-mono text-sm bg-red-500 text-white hover:bg-red-600 shadow-sm"
                >
                  ĐỒNG Ý XÓA
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Image Area */}
        <div className={cn(
          "relative rounded-3xl overflow-hidden aspect-[3/4] md:aspect-square lg:aspect-[4/5] shadow-lg sticky top-24 transition-all duration-700",
          isPremium ? "bg-muted" : "bg-cream-dark/20 backdrop-blur-md"
        )}>
          {isProcessing && (
            <div className="absolute inset-0 bg-cream/70 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-3">
              <Loader2 className="size-8 text-terracotta animate-spin" />
              <div className="text-center">
                <p className="font-heading font-bold text-ink">AI ĐANG PHÂN TÍCH</p>
                <p className="text-xs font-mono text-ink-muted mt-1">Quá trình này có thể mất vài giây...</p>
              </div>
            </div>
          )}
          
          <img 
            src={item.imageUrl} 
            alt={itemName} 
            className="w-full h-full object-cover" 
          />

          <div className="absolute top-4 left-4 flex gap-2 z-20">
            {item.category && (
              <span className="bg-white/90 backdrop-blur-sm text-ink px-3 py-1.5 rounded-full text-[10px] font-mono font-bold shadow-sm uppercase tracking-wider">
                {item.category.name}
              </span>
            )}
            {item.status === WardrobeItemStatus.Selling && (
              <span className="bg-terracotta/90 backdrop-blur-sm text-cream px-3 py-1.5 rounded-full text-[10px] font-mono font-bold shadow-sm flex items-center gap-1">
                <Tag className="size-3" /> ĐANG BÁN
              </span>
            )}
            {isFailed && (
              <span className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[10px] font-mono font-bold shadow-sm">
                AI LỖI
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Details Area */}
        <div className="flex flex-col gap-8 pt-4">
          
          {/* Title Header */}
          <div className="space-y-3">
            <h1 className={cn(
              "text-4xl md:text-5xl tracking-tight text-ink",
              isPremium ? "font-sans font-light" : "font-heading font-medium"
            )}>
              {itemName}
            </h1>
            <p className="text-sm font-mono text-ink-muted flex items-center gap-2">
              <span className="inline-block size-3 rounded-full border border-black/10" style={{ backgroundColor: getColorHex(item.color) }} />
              {item.color ? `Màu ${item.color.toLowerCase()}` : "Không có thông tin màu"}
              <span className="mx-2 opacity-50">•</span>
              Đã thêm vào {new Date(item.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>

          <div className="h-px w-full bg-cream-dark" />

          {/* AI Metadata Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-ink">
              <Info className="size-5" />
              <h3 className="font-heading text-xl font-semibold tracking-wide">Chi tiết phân tích (AI)</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
              
              <div className="space-y-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">Chất liệu (Material)</p>
                <p className="font-sans text-lg text-ink font-medium">{item.material || "—"}</p>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">Kiểu dáng (Fit)</p>
                <p className="font-sans text-lg text-ink font-medium">{item.fit || "—"}</p>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">Họa tiết (Pattern)</p>
                <p className="font-sans text-lg text-ink font-medium">{item.pattern || "—"}</p>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">Mùa (Seasonality)</p>
                <p className="font-sans text-lg text-ink font-medium">{item.seasonality || "—"}</p>
              </div>
              
            </div>
          </div>

          {/* Tags / Style */}
          {item.style && (
            <div className="space-y-3 mt-4">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">Phong cách (Style)</p>
              <div className="flex flex-wrap gap-2">
                {item.style.split(',').map((styleTag) => (
                  <span 
                    key={styleTag.trim()} 
                    className="px-4 py-2 rounded-xl bg-cream-dark/40 text-ink text-sm font-medium border border-cream-dark shadow-sm"
                  >
                    #{styleTag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions (Future placeholder) */}
          <div className="mt-8 pt-8 border-t border-cream-dark flex flex-col sm:flex-row gap-4">
            <Button 
              className={cn(
                "flex-1 rounded-2xl h-14 font-semibold tracking-wide text-sm transition-all",
                isPremium ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-terracotta text-cream hover:bg-terracotta/90"
              )}
            >
              GỢI Ý PHỐI ĐỒ TỪ AI
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 rounded-2xl h-14 border-ink text-ink hover:bg-ink hover:text-cream font-mono text-sm transition-colors"
            >
              CHỤP ẢNH MỚI
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
