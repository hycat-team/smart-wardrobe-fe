"use client";
import { useRouter } from "next/navigation";
import { useWardrobeItemDetail, useBulkDeleteWardrobeItems } from "@/features/wardrobe/queries/wardrobe.queries";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle, Sparkles } from "lucide-react";
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
import { WardrobeItemStatus, WardrobeItemRes as WardrobeItem } from "@/features/wardrobe/types";
import { applyCloudinaryTrim } from "@/lib/cloudinary";
import Image from "next/image";

// Helper to normalize color to HEX
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

interface WardrobeItemDetailClientProps {
  itemId: string;
  initialItem?: WardrobeItem;
}

export function WardrobeItemDetailClient({ itemId, initialItem }: WardrobeItemDetailClientProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const { data: item, isLoading, error } = useWardrobeItemDetail(itemId, initialItem);
  const { mutate: bulkDelete, isPending: isDeleting } = useBulkDeleteWardrobeItems();

  const handleDelete = () => {
    bulkDelete({ ids: [itemId] }, {
      onSuccess: () => {
        router.push("/wardrobe");
      }
    });
  };

  if (isLoading && !item) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="size-8 animate-spin text-[#111]" />
        <p className="text-sm font-['IBM_Plex_Mono'] text-[#666] animate-pulse">Đang tải thông tin trang phục...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center max-w-md mx-auto">
        <AlertCircle className="size-12 text-red-500/80" />
        <h2 className="text-xl font-['Playfair_Display'] font-medium text-[#111]">Không tìm thấy trang phục</h2>
        <p className="text-sm text-[#666]">Trang phục này có thể đã bị xóa hoặc không tồn tại. Vui lòng kiểm tra lại.</p>
        <Button onClick={() => router.push("/wardrobe")} variant="outline" className="mt-4 font-['IBM_Plex_Mono']">
          QUAY LẠI TỦ ĐỒ
        </Button>
      </div>
    );
  }

  const isProcessing = item.status === WardrobeItemStatus.Processing;
  const isFailed = item.status === WardrobeItemStatus.Failed;
  
  const categoryName = typeof item.category === 'object' ? (item.category as any)?.name : item.category;
  
  const itemName = categoryName 
    ? `${categoryName} ${item.color || ""} ${item.style || ""}`.trim()
    : "Trang phục chưa phân loại";

  return (
    <div className="flex-1 min-h-screen bg-white text-[#111] pb-24 md:pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col pt-8 lg:pt-12">
        
        {/* Navigation & Header Actions */}
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href="/wardrobe" 
            className="inline-flex items-center gap-2 text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-[0.12em] text-[#666] hover:text-[#111] transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Trở về tủ đồ
          </Link>

          <div className="flex items-center gap-6 text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-[0.12em]">
            <button
              onClick={() => router.push(`/wardrobe/item/${itemId}/edit`)}
              className="text-[#666] hover:text-[#111] transition-colors border-b border-transparent hover:border-[#111] pb-0.5"
            >
              Sửa trang phục
            </button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  disabled={isDeleting}
                  className="text-[#666] hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500 pb-0.5 disabled:opacity-50"
                >
                  {isDeleting ? "Đang xóa..." : "Xóa"}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-none border border-black/10 bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-['Playfair_Display'] text-2xl font-medium text-[#111]">Xác nhận xóa?</AlertDialogTitle>
                  <AlertDialogDescription className="font-['IBM_Plex_Mono'] text-[12px] text-[#666] leading-relaxed">
                    Hành động này không thể hoàn tác. Món đồ này có thể biến mất khỏi các phối đồ đang sử dụng nó.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 flex gap-4">
                  <AlertDialogCancel className="rounded-none border border-black/10 bg-white font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest flex-1 hover:bg-[#F8F7F5] transition-colors">HỦY BỎ</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="rounded-none bg-red-600 text-white hover:bg-red-700 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest flex-1 transition-colors"
                  >
                    ĐỒNG Ý XÓA
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Main Split Layout: 5/7 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Minimal Image Area */}
          <div className="lg:col-span-5 relative w-full aspect-[3/4] bg-[#F7F6F4] p-8 md:p-12 transition-all duration-700">
            {isProcessing && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                <div className="size-10 border border-[#111] border-t-transparent rounded-full animate-spin" />
                <div className="text-center font-['IBM_Plex_Mono']">
                  <p className="text-[11px] font-medium text-[#111] uppercase tracking-[0.12em] animate-pulse">AI is analyzing</p>
                  <p className="text-[9px] text-[#888] uppercase tracking-[0.12em] mt-2">Please wait...</p>
                </div>
              </div>
            )}
            
            <Image fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={applyCloudinaryTrim(item.imageUrl)} 
              alt={itemName}
              className="w-full h-full object-contain drop-shadow-sm" 
            />

            <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
              {item.status === WardrobeItemStatus.Selling && (
                <span className="bg-red-600 text-white px-3 py-1.5 font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.12em]">
                  For Sale
                </span>
              )}
              {isFailed && (
                <span className="bg-red-600 text-white px-3 py-1.5 font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.12em]">
                  AI Failed
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Editorial Details Area */}
          <div className="lg:col-span-7 flex flex-col gap-10 md:gap-16 pt-4 lg:pt-8">
            
            {/* Title Header */}
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] font-medium text-[#111] leading-[1.1]">
                {itemName}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.12em] text-[#666]">
                <span>{item.brand || categoryName || "ACNE STUDIOS"}</span>
                <span className="w-1 h-1 rounded-full bg-[#D9D9D9]" />
                <div className="flex items-center gap-2">
                  <div
              className="w-[14px] h-[14px] rounded-full border border-black/10 shadow-sm"
              style={{ backgroundColor: item.colorHex }}
              title={item.color || "Màu sắc"}
            />
                  <span>{item.color || "No Color"}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-[#D9D9D9]" />
                {/* <span>Size {item.size || "S"}</span> */}
                {/* <span className="w-1 h-1 rounded-full bg-[#D9D9D9]" /> */}
                <span>Added {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
              </div>
            </div>



            {/* AI Metadata Minimalist List */}
            <div className="flex flex-col gap-6 pt-10 border-t border-black/10">
              <h3 className="font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-[0.12em] text-[#111] flex items-center gap-2">
                <Sparkles className="size-3.5" /> Dữ liệu trang phục
              </h3>
              
              <div className="flex flex-col gap-4 font-['IBM_Plex_Mono'] text-[12px] tracking-[0.05em]">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  <span className="text-[#888] uppercase">Vải</span>
                  <span className="col-span-2 sm:col-span-3 text-[#111]">{item.material || "—"}</span>
                </div>
                <div className="w-full h-[1px] bg-black/5" />
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  <span className="text-[#888] uppercase">Kiểu dáng</span>
                  <span className="col-span-2 sm:col-span-3 text-[#111]">{item.fit || "—"}</span>
                </div>
                <div className="w-full h-[1px] bg-black/5" />
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  <span className="text-[#888] uppercase">Họa tiết</span>
                  <span className="col-span-2 sm:col-span-3 text-[#111]">{item.pattern || "—"}</span>
                </div>
                <div className="w-full h-[1px] bg-black/5" />
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  <span className="text-[#888] uppercase">Thời tiết</span>
                  <span className="col-span-2 sm:col-span-3 text-[#111]">{item.seasonality || "—"}</span>
                </div>
              </div>
            </div>

            {/* Tags / Style */}
            {item.style && (
              <div className="pt-4 flex flex-col gap-4">
                <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.12em] text-[#888]">Phong cách</p>
                <div className="flex flex-wrap gap-2">
                  {item.style.split(',').map((styleTag: string) => (
                    <span 
                      key={styleTag.trim()} 
                      className="px-4 py-2 border border-[#E5E5E5] text-[#666] font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest"
                    >
                      #{styleTag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
