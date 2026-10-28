"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, UploadCloud, Pencil, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { brandPortalApi } from "@/features/brand-portal/api/brand-portal.api";
import { BrandItemRes } from "@/features/brand-portal/types";
import { useBrandItemSSE } from "@/features/brand-portal/hooks/useBrandItemSSE";
import { getAnalysisErrorMessage, getAnalysisReviewMessage } from "@/features/wardrobe/utils/analysis-status";
import { BrandItemMetaChips } from "@/features/brand-portal/components/BrandItemMeta";
import {
  getItemDisplayStatus,
  getItemErrorReason,
  getItemReviewReason,
} from "@/features/brand-portal/utils/item-status";
import { brandPortalPath } from "@/features/brand-portal/utils/routes";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

function sortByCreatedAtDesc(items: BrandItemRes[]) {
  return [...items].sort((a, b) => {
    const left = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const right = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return right - left;
  });
}

export function BrandProductsClient({ brandId }: { brandId: string }) {
  const [products, setProducts] = useState<BrandItemRes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    productCode: "",
    price: "",
    description: "",
    status: "draft",
    imageUrl: "",
    imagePublicId: "",
  });

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await brandPortalApi.getBrandItems(brandId, { itemType: "product" });
      setProducts(sortByCreatedAtDesc(data));
    } catch (e) {
      console.error("Error fetching products", e);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setIsLoading(false);
    }
  }, [brandId]);

  useBrandItemSSE(brandId, products, fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenCreate = () => {
    setSelectedFile(null);
    setFormData({
      name: "",
      productCode: "",
      price: "",
      description: "",
      status: "draft",
      imageUrl: "",
      imagePublicId: "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      let finalImageUrl = formData.imageUrl;
      let finalImagePublicId = formData.imagePublicId;

      if (!formData.name.trim()) {
        toast.error("Vui lòng nhập tên sản phẩm");
        return;
      }

      if (selectedFile) {
        toast("Đang tải ảnh lên...");
        const sigData = await brandPortalApi.getBrandItemUploadSignature(brandId);
        const uploadRes = await uploadToCloudinary({
          file: selectedFile,
          signatureParams: {
            apiKey: sigData.apiKey,
            timestamp: sigData.timestamp,
            signature: sigData.signature,
            folder: sigData.folder,
          }
        });
        finalImageUrl = uploadRes.secure_url;
        finalImagePublicId = uploadRes.public_id;
      }

      if (!finalImageUrl || !finalImagePublicId) {
        toast.error("Vui lòng tải lên hình ảnh sản phẩm");
        return;
      }

      const parsedPrice = Number(formData.price.replace(/[^\d.]/g, ""));
      await brandPortalApi.createBrandItem(brandId, {
        name: formData.name,
        productCode: formData.productCode || undefined,
        description: formData.description || undefined,
        price: Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : undefined,
        imageUrl: finalImageUrl,
        imagePublicId: finalImagePublicId,
        itemType: "product",
        status: formData.status,
      });
      toast.success("Đã tạo sản phẩm mới");

      await fetchProducts();
      setIsDialogOpen(false);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      console.error("Error saving product", error);
      toast.error(err?.response?.data?.message || err?.message || "Không thể lưu sản phẩm");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Button
          onClick={handleOpenCreate}
          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm sản phẩm
        </Button>
      </div>

      <div className="bg-card border border-border shadow-sm p-6 rounded-3xl overflow-x-auto">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Sản phẩm</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Product Code</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Giá bán</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Trạng thái</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Chưa có sản phẩm nào
                </TableCell>
              </TableRow>
            ) : products.map(product => {
              const displayStatus = getItemDisplayStatus(product);
              const errorReason = getItemErrorReason(product);
              const reviewReason = getItemReviewReason(product);
              const imageUrl = product.fashionItem?.imageUrl;

              return (
                <TableRow key={product.id} className="border-border hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-muted rounded-xl overflow-hidden shrink-0 border border-border">
                        {imageUrl ? (
                          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <UploadCloud className="size-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <Link
                          href={`${brandPortalPath(brandId, 'products')}/${product.id}`}
                          className="font-bold text-sm text-foreground hover:underline line-clamp-2 max-w-[260px]"
                        >
                          {product.name || 'Sản phẩm chưa đặt tên'}
                        </Link>
                        <BrandItemMetaChips item={product} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{product.productCode || '-'}</TableCell>
                  <TableCell className="text-sm font-bold text-primary whitespace-nowrap">
                    {product.price != null ? `${product.price.toLocaleString('vi-VN')}đ` : '—'}
                  </TableCell>
                  <TableCell>
                    {displayStatus === 'active' && (
                      <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        Active
                      </span>
                    )}
                    {displayStatus === 'analyzing' && (
                      <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 inline-flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Đang phân tích
                      </span>
                    )}
                    {displayStatus === 'failed' && (
                      <span
                        title={errorReason ? getAnalysisErrorMessage(errorReason) : undefined}
                        className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap rounded-full bg-destructive/15 text-destructive inline-flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" /> Phân tích thất bại
                      </span>
                    )}
                    {displayStatus === 'needs_review' && (
                      <span
                        title={reviewReason ? getAnalysisReviewMessage(reviewReason) : undefined}
                        className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      >
                        Cần chọn danh mục
                      </span>
                    )}
                    {displayStatus === 'archived' && (
                      <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap rounded-full bg-muted text-muted-foreground">
                        Archived
                      </span>
                    )}
                    {displayStatus === 'draft' && (
                      <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap rounded-full bg-muted text-muted-foreground">
                        Draft
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`${brandPortalPath(brandId, 'digital-sample-lab/report')}/${product.id}`}
                        title="Xem feedback"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <MessageSquare className="size-4" />
                      </Link>
                      <Link
                        href={`${brandPortalPath(brandId, 'products')}/${product.id}`}
                        className="text-sm font-bold underline decoration-1 underline-offset-2 text-muted-foreground hover:text-foreground flex items-center gap-1 whitespace-nowrap"
                      >
                        <Pencil className="size-3" /> Sửa
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto bg-card rounded-3xl border border-border shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
              Thêm sản phẩm
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              <label className="block w-full aspect-video bg-muted/50 border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted transition-colors group relative overflow-hidden rounded-2xl">
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="size-10 rounded-full bg-background flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                      <UploadCloud className="size-4 text-foreground" />
                    </div>
                    <p className="text-[10px] uppercase tracking-widest font-bold">Upload ảnh</p>
                  </>
                )}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-foreground">Tên Sản Phẩm</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ví dụ: Áo Sơ Mi"
                    className="rounded-xl border-border bg-muted/50 focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-foreground">Trạng thái</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" className="flex w-full h-[40px] items-center justify-between rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                        {formData.status === "active" ? "Hoạt động (Active)" : formData.status === "archived" ? "Lưu trữ (Archived)" : "Bản nháp (Draft)"}
                        <ChevronDownIcon className="size-4 opacity-50" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[--radix-dropdown-menu-trigger-width]">
                      <DropdownMenuItem onClick={() => setFormData(prev => ({ ...prev, status: "draft" }))}>Bản nháp (Draft)</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFormData(prev => ({ ...prev, status: "active" }))}>Hoạt động (Active)</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFormData(prev => ({ ...prev, status: "archived" }))}>Lưu trữ (Archived)</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-foreground">Mô tả</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả ngắn gọn về sản phẩm"
                  className="rounded-xl border-border bg-muted/50 focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-foreground">Product Code</label>
                  <Input
                    value={formData.productCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, productCode: e.target.value }))}
                    className="rounded-xl border-border bg-muted/50 focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-foreground">Giá Bán (VNĐ)</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="rounded-xl border-border bg-muted/50 focus-visible:ring-1 focus-visible:ring-ring text-primary font-bold"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full uppercase tracking-widest font-bold text-[11px] h-12"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Lưu Sản Phẩm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
