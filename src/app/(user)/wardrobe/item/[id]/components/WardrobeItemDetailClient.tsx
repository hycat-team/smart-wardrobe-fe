"use client";
import { useRouter } from "next/navigation";
import {
  useWardrobeItemDetail,
  useBulkDeleteWardrobeItems,
} from "@/features/wardrobe/queries/wardrobe.queries";
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
import {
  WardrobeItemStatus,
  WardrobeItemRes as WardrobeItem,
} from "@/features/wardrobe/types";
import { applyCloudinaryTrim } from "@/lib/cloudinary";
import Image from "next/image";

interface WardrobeItemDetailClientProps {
  itemId: string;
  initialItem?: WardrobeItem;
}

export function WardrobeItemDetailClient({
  itemId,
  initialItem,
}: WardrobeItemDetailClientProps) {
  const router = useRouter();

  const {
    data: item,
    isLoading,
    error,
  } = useWardrobeItemDetail(itemId, initialItem);
  const { mutate: bulkDelete, isPending: isDeleting } =
    useBulkDeleteWardrobeItems();

  const handleDelete = () => {
    bulkDelete(
      { ids: [itemId] },
      {
        onSuccess: () => {
          router.push("/wardrobe");
        },
      },
    );
  };

  if (isLoading && !item) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="size-8 animate-spin text-foreground" />
        <p className="text-sm font-semibold text-muted-foreground animate-pulse">
          Đang tải thông tin trang phục...
        </p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center max-w-md mx-auto">
        <AlertCircle className="size-12 text-destructive/80" />
        <h2 className="text-xl font-semibold text-foreground">
          Không tìm thấy trang phục
        </h2>
        <p className="text-sm text-muted-foreground">
          Trang phục này có thể đã bị xóa hoặc không tồn tại. Vui lòng kiểm tra
          lại.
        </p>
        <Button
          onClick={() => router.push("/wardrobe")}
          variant="outline"
          className="mt-4 rounded-full"
        >
          QUAY LẠI TỦ ĐỒ
        </Button>
      </div>
    );
  }

  const isProcessing = item.status === WardrobeItemStatus.Processing;
  const isFailed = item.status === WardrobeItemStatus.Failed;

  const categoryName =
    typeof item.category === "object" &&
    item.category !== null &&
    "name" in item.category
      ? String(item.category.name)
      : item.category;

  const itemName = categoryName
    ? `${categoryName} ${item.color || ""} ${item.style || ""}`.trim()
    : "Trang phục chưa phân loại";

  return (
    <div className="flex-1 min-h-screen bg-background text-foreground pb-24 md:pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col pt-8 lg:pt-12">
        {/* Navigation & Header Actions */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/wardrobe"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> Trở về tủ đồ
          </Link>

          <div className="flex items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <button
              onClick={() => router.push(`/wardrobe/item/${itemId}/edit`)}
              className="border-b border-transparent pb-0.5 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              Sửa trang phục
            </button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  disabled={isDeleting}
                  className="border-b border-transparent pb-0.5 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive disabled:opacity-50"
                >
                  {isDeleting ? "Đang xóa..." : "Xóa"}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl border border-border bg-background">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl font-semibold text-foreground">
                    Xác nhận xóa?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="font-semibold text-[12px] text-muted-foreground leading-relaxed">
                    Hành động này không thể hoàn tác. Món đồ này có thể biến mất
                    khỏi các phối đồ đang sử dụng nó.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 flex gap-4">
                  <AlertDialogCancel className="flex-1 rounded-xl border border-border bg-background text-[11px] font-semibold uppercase tracking-widest transition-all duration-200 hover:bg-muted">
                    HỦY BỎ
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="flex-1 rounded-xl bg-destructive text-[11px] font-semibold uppercase tracking-widest text-primary-foreground transition-all duration-200 hover:bg-destructive/90"
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
          <div className="image-frame relative w-full aspect-[3/4] p-8 md:p-12 lg:col-span-5 transition-all duration-200">
            {isProcessing && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                <div className="size-10 border border-foreground border-t-transparent rounded-full animate-spin" />
                <div className="text-center font-semibold">
                  <p className="text-[11px] font-medium text-foreground uppercase tracking-[0.12em] animate-pulse">
                    AI is analyzing
                  </p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-[0.12em] mt-2">
                    Please wait...
                  </p>
                </div>
              </div>
            )}

            <Image
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={applyCloudinaryTrim(item.imageUrl)}
              alt={itemName}
              className="h-full w-full object-contain drop-shadow-sm"
            />

            <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
              {item.status === WardrobeItemStatus.Selling && (
                <span className="rounded-full bg-destructive px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-primary-foreground">
                  For Sale
                </span>
              )}
              {isFailed && (
                <span className="rounded-full bg-destructive px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-primary-foreground">
                  AI Failed
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Editorial Details Area */}
          <div className="lg:col-span-7 flex flex-col gap-10 md:gap-16 pt-4 lg:pt-8">
            {/* Title Header */}
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl font-semibold leading-[1.1] text-foreground md:text-5xl lg:text-6xl">
                {itemName}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <span>{item.brand || categoryName || "ACNE STUDIOS"}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-2">
                  <div
                    className="h-[14px] w-[14px] rounded-full border border-border shadow-sm"
                    style={{ backgroundColor: item.colorHex }}
                    title={item.color || "Màu sắc"}
                  />
                  <span>{item.color || "No Color"}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-border" />
                {/* <span>Size {item.size || "S"}</span> */}
                {/* <span className="w-1 h-1 rounded-full bg-border" /> */}
                <span>
                  Added{" "}
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* AI Metadata Minimalist List */}
            <div className="flex flex-col gap-6 pt-10 border-t border-border">
              <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">
                <Sparkles className="size-3.5" /> Dữ liệu trang phục
              </h3>

              <div className="flex flex-col gap-4 text-[12px] tracking-[0.05em] text-foreground">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  <span className="text-muted-foreground uppercase">Vải</span>
                  <span className="col-span-2 sm:col-span-3 text-foreground">
                    {item.material || "—"}
                  </span>
                </div>
                <div className="h-px w-full bg-border" />

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  <span className="text-muted-foreground uppercase">
                    Kiểu dáng
                  </span>
                  <span className="col-span-2 sm:col-span-3 text-foreground">
                    {item.fit || "—"}
                  </span>
                </div>
                <div className="h-px w-full bg-border" />

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  <span className="text-muted-foreground uppercase">
                    Họa tiết
                  </span>
                  <span className="col-span-2 sm:col-span-3 text-foreground">
                    {item.pattern || "—"}
                  </span>
                </div>
                <div className="h-px w-full bg-border" />

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  <span className="text-muted-foreground uppercase">
                    Thời tiết
                  </span>
                  <span className="col-span-2 sm:col-span-3 text-foreground">
                    {item.seasonality || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags / Style */}
            {item.style && (
              <div className="pt-4 flex flex-col gap-4">
                <p className="font-semibold text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Phong cách
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.style.split(",").map((styleTag: string) => (
                    <span
                      key={styleTag.trim()}
                      className="rounded-full border border-border px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
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
