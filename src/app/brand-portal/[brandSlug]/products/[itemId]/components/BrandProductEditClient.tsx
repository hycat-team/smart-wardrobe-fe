"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, MessageSquare, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetBrandItemDetail,
  useRetryBrandItemAnalysis,
  useUpdateBrandItem,
} from "@/features/brand-portal/queries/brand-portal.queries";
import { BrandItemMetaPanel } from "@/features/brand-portal/components/BrandItemMeta";
import {
  getItemDisplayStatus,
  getItemErrorReason,
  getItemReviewReason,
  isItemAnalyzing,
} from "@/features/brand-portal/utils/item-status";
import { brandPortalPath } from "@/features/brand-portal/utils/routes";
import { useCategories } from "@/features/wardrobe/queries/wardrobe.queries";
import { getAnalysisErrorMessage, getAnalysisReviewMessage } from "@/features/wardrobe/utils/analysis-status";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "draft", label: "Bản nháp (Draft)" },
  { value: "active", label: "Hoạt động (Active)" },
  { value: "archived", label: "Lưu trữ (Archived)" },
];

export default function BrandProductEditClient({ brandId, itemId }: { brandId: string; itemId: string }) {
  const router = useRouter();
  const { data: item, isLoading } = useGetBrandItemDetail(brandId, itemId);
  const { data: categories = [] } = useCategories();
  const { mutateAsync: updateItem, isPending: isSaving } = useUpdateBrandItem(brandId);
  const { mutateAsync: retryAnalysis, isPending: isRetrying } = useRetryBrandItemAnalysis(brandId);

  const [form, setForm] = useState({
    name: "",
    productCode: "",
    price: "",
    description: "",
    status: "draft",
  });
  const [productCodeError, setProductCodeError] = useState<string | null>(null);
  const [retryCategoryId, setRetryCategoryId] = useState("");

  useEffect(() => {
    if (!item) return;
    setForm({
      name: item.name || "",
      productCode: item.productCode || "",
      price: item.price != null ? String(item.price) : "",
      description: item.description || "",
      status: String(item.status || "draft").toLowerCase(),
    });
  }, [item?.id, item?.updatedAt]);

  if (isLoading || !item) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const displayStatus = getItemDisplayStatus(item);
  const analyzing = isItemAnalyzing(item);
  const failed = displayStatus === "failed";
  const needsReview = displayStatus === "needs_review";
  const errorReason = getItemErrorReason(item);
  const reviewReason = getItemReviewReason(item);
  const canRetry = failed || needsReview;
  const saveDisabled = isSaving || analyzing || failed;

  const handleSave = async () => {
    setProductCodeError(null);
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return;
    }
    const parsedPrice = Number(form.price.replace(/[^\d.]/g, ""));
    try {
      await updateItem({
        itemId,
        payload: {
          name: form.name,
          productCode: form.productCode || undefined,
          description: form.description || undefined,
          price: Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : undefined,
          status: failed ? undefined : form.status,
        },
      });
      toast.success("Đã cập nhật sản phẩm");
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      if (err?.response?.status === 409) {
        setProductCodeError(err?.response?.data?.message || "Product Code đã tồn tại trong thương hiệu.");
        return;
      }
      toast.error(err?.response?.data?.message || "Không thể cập nhật sản phẩm");
    }
  };

  const handleRetry = async () => {
    if (!retryCategoryId) {
      toast.error("Vui lòng chọn danh mục trước khi phân tích lại");
      return;
    }
    try {
      await retryAnalysis({ itemId, data: { categoryId: retryCategoryId } });
    } catch {
      // toast handled by mutation
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          className="rounded-full"
          render={<Link href={brandPortalPath(brandId, "products")} />}
        >
          <ArrowLeft className="mr-2 size-4" /> Danh sách sản phẩm
        </Button>
        <Button
          variant="outline"
          className="rounded-full"
          render={<Link href={`${brandPortalPath(brandId, "digital-sample-lab/report")}/${itemId}`} />}
        >
          <MessageSquare className="mr-2 size-4" /> Xem feedback
        </Button>
      </div>

      {failed && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <p className="font-semibold">Phân tích thất bại</p>
          <p className="mt-1">{errorReason ? getAnalysisErrorMessage(errorReason) : "AI không thể phân tích ảnh này."}</p>
          <p className="mt-1 text-xs">Sản phẩm đang bị khóa chỉnh sửa; chỉ có thể phân tích lại.</p>
        </div>
      )}

      {needsReview && !failed && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-700">
          <p className="font-semibold">Cần chọn danh mục</p>
          <p className="mt-1">{reviewReason ? getAnalysisReviewMessage(reviewReason) : "AI chưa chắc chắn về danh mục của sản phẩm."}</p>
        </div>
      )}

      {analyzing && (
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 text-sm text-blue-700">
          AI đang phân tích sản phẩm. Trang sẽ tự cập nhật khi hoàn tất.
        </div>
      )}

      {canRetry && (
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Phân tích lại</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Select value={retryCategoryId} onValueChange={(value) => setRetryCategoryId(value ?? '')}>
              <SelectTrigger className="w-full rounded-xl sm:max-w-xs">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleRetry} disabled={isRetrying} className="rounded-xl">
              {isRetrying ? <Loader2 className="mr-2 size-4 animate-spin" /> : <RefreshCw className="mr-2 size-4" />}
              Phân tích lại
            </Button>
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="size-28 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
              {item.fashionItem?.imageUrl ? (
                <img src={item.fashionItem.imageUrl} alt={item.name} className="size-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Trạng thái</p>
              <p className="mt-1 text-sm font-semibold capitalize text-foreground">{displayStatus}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                Ảnh sản phẩm chưa hỗ trợ chỉnh sửa tại đây.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground">Tên sản phẩm</label>
              <Input
                value={form.name}
                disabled={saveDisabled}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground">Product Code</label>
                <Input
                  value={form.productCode}
                  disabled={saveDisabled}
                  onChange={(e) => setForm((prev) => ({ ...prev, productCode: e.target.value }))}
                  className="rounded-xl"
                />
                {productCodeError && <p className="text-xs text-destructive">{productCodeError}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground">Giá bán (VNĐ)</label>
                <Input
                  type="number"
                  value={form.price}
                  disabled={saveDisabled}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                  className="rounded-xl font-bold text-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground">Mô tả</label>
              <Textarea
                value={form.description}
                disabled={saveDisabled}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="min-h-24 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground">Trạng thái hiển thị</label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm((prev) => ({ ...prev, status: value ?? 'draft' }))}
                disabled={saveDisabled}
              >
                <SelectTrigger className="w-full rounded-xl sm:max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSave}
              disabled={saveDisabled}
              className="w-full rounded-full"
            >
              {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <BrandItemMetaPanel item={item} />
          <section className="rounded-3xl border border-border bg-card p-6 text-xs text-muted-foreground shadow-sm">
            <p>Mã sản phẩm: {item.productCode || "—"}</p>
            <p className="mt-1">Tạo lúc: {item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "—"}</p>
            <p className="mt-1">Cập nhật: {item.updatedAt ? new Date(item.updatedAt).toLocaleString("vi-VN") : "—"}</p>
          </section>
        </div>
      </div>

      <Button variant="ghost" className="w-fit rounded-full" onClick={() => router.refresh()}>
        <RefreshCw className="mr-2 size-4" /> Làm mới dữ liệu
      </Button>
    </div>
  );
}
