"use client";
import { useState, useEffect } from "react";
import { Plus, UploadCloud, Pencil, Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

export function BrandProductsClient({ brandId }: { brandId: string }) {
  const [products, setProducts] = useState<BrandItemRes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    productCode: "",
    price: "",
    description: "",
    status: "draft",
    imageUrl: "",
    imagePublicId: "",
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await brandPortalApi.getBrandItems(brandId);
      setProducts(data);
    } catch (e) {
      console.error("Error fetching products", e);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [brandId]);

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

  const handleOpenDialog = (product?: BrandItemRes) => {
    setSelectedFile(null);
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        productCode: product.productCode || "",
        price: product.price.toString(),
        description: product.description || "",
        status: product.status || "draft",
        imageUrl: product.imageUrl || product.imageUrls?.[0] || "",
        imagePublicId: "",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        productCode: `PC-${Math.floor(Math.random() * 10000)}`,
        price: "",
        description: "",
        status: "draft",
        imageUrl: "",
        imagePublicId: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      let finalImageUrl = formData.imageUrl;
      let finalImagePublicId = formData.imagePublicId;

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

      if (!editingId && (!finalImageUrl || !finalImagePublicId)) {
        toast.error("Vui lòng tải lên hình ảnh sản phẩm");
        setIsSaving(false);
        return;
      }

      if (editingId) {
        await brandPortalApi.updateBrandItem(brandId, editingId, {
          name: formData.name,
          productCode: formData.productCode,
          description: formData.description,
          price: parseInt(formData.price) || 0,
          status: formData.status,
          ...(selectedFile ? { imageUrl: finalImageUrl, imagePublicId: finalImagePublicId } : {})
        });
        toast.success("Đã cập nhật sản phẩm");
      } else {
        await brandPortalApi.createBrandItem(brandId, {
          name: formData.name,
          productCode: formData.productCode,
          description: formData.description,
          price: parseInt(formData.price) || 0,
          imageUrl: finalImageUrl,
          imagePublicId: finalImagePublicId,
          itemType: "product",
          status: formData.status
        });
        toast.success("Đã tạo sản phẩm mới");
      }

      await fetchProducts();
      setIsDialogOpen(false);
    } catch (e: any) {
      console.error("Error saving product", e);
      toast.error(e?.response?.data?.message || e?.message || "Không thể lưu sản phẩm");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        {/* <h1 className="text-3xl font-bold tracking-tight">Sản phẩm</h1> */}
        <Button
          onClick={() => handleOpenDialog()}
          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm sản phẩm
        </Button>
      </div>

      <div className="bg-card border border-border shadow-sm p-6 rounded-3xl overflow-x-auto">
        <Table className="min-w-[600px]">
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
            ) : products.map(product => (
              <TableRow key={product.id} className="border-border hover:bg-muted/50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-xl overflow-hidden shrink-0 border border-border">
                      {product.imageUrl || product.imageUrls?.[0] ? (
                        <img src={product.imageUrl || product.imageUrls?.[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <UploadCloud className="size-4" />
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-sm min-w-[120px] line-clamp-2 text-foreground">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{product.productCode || '-'}</TableCell>
                <TableCell className="text-sm font-bold text-primary whitespace-nowrap">{product.price?.toLocaleString()}đ</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap rounded-full ${
                    product.status === 'ACTIVE' 
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {product.status || 'DRAFT'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleOpenDialog(product)}
                    className="text-sm font-bold underline decoration-1 underline-offset-2 text-muted-foreground hover:text-foreground flex items-center gap-1 justify-end w-full whitespace-nowrap"
                  >
                    <Pencil className="size-3" /> Sửa
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto bg-card rounded-3xl border border-border shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
              {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              {/* Image Upload Area */}
              <label className="block w-full aspect-video bg-muted/50 border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted transition-colors group relative overflow-hidden rounded-2xl">
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="size-10 rounded-full bg-background flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                      <UploadCloud className="size-4 text-foreground" />
                    </div>
                    <p className="text-[10px] uppercase tracking-widest font-bold">Upload Ảnh</p>
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
                <label className="text-[10px] uppercase tracking-widest font-bold text-foreground">Mô Tả Sản Phẩm</label>
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
