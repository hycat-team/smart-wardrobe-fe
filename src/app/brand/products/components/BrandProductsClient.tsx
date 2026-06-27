"use client";
import { useState, useEffect } from "react";
import { Plus, X, UploadCloud, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockProducts } from "@/lib/mock-data/b2b";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function BrandProductsClient() {
  const [products, setProducts] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    imageUrl: "",
  });

  useEffect(() => {
    // Load default mock products for this brand
    const defaultProducts = mockProducts.filter(p => p.brandId === 'brand_001');

    // Load custom products from localStorage
    try {
      const stored = localStorage.getItem("brand_custom_products");
      if (stored) {
        const customProducts = JSON.parse(stored);
        setProducts([...customProducts, ...defaultProducts]);
      } else {
        setProducts(defaultProducts);
      }
    } catch (e) {
      setProducts(defaultProducts);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenDialog = (product?: any) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        sku: product.sku,
        price: product.price.toString(),
        imageUrl: product.imageUrls[0] || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        sku: `SKU-${Math.floor(Math.random() * 10000)}`,
        price: "",
        imageUrl: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    try {
      const stored = localStorage.getItem("brand_custom_products");
      let customProducts: any[] = stored ? JSON.parse(stored) : [];

      if (editingId) {
        // Only allow editing custom products (if it's a mock product, we could fork it, but let's just allow overriding)
        const existingIndex = customProducts.findIndex(p => p.id === editingId);

        const updatedProduct = {
          id: editingId,
          brandId: "brand_001",
          name: formData.name,
          sku: formData.sku,
          price: parseInt(formData.price) || 0,
          originalPrice: parseInt(formData.price) || 0,
          imageUrls: [formData.imageUrl],
          category: "Chung",
          tags: ["Custom"],
        };

        if (existingIndex >= 0) {
          customProducts[existingIndex] = updatedProduct;
        } else {
          // Forking a mock product
          customProducts.push(updatedProduct);
        }
      } else {
        // Create new
        const newProduct = {
          id: `prod_custom_${Date.now()}`,
          brandId: "brand_001",
          name: formData.name,
          sku: formData.sku,
          price: parseInt(formData.price) || 0,
          originalPrice: parseInt(formData.price) || 0,
          imageUrls: [formData.imageUrl],
          category: "Chung",
          tags: ["Custom"],
        };
        customProducts.push(newProduct);
      }

      localStorage.setItem("brand_custom_products", JSON.stringify(customProducts));

      // Update state
      const defaultProducts = mockProducts.filter(p => p.brandId === 'brand_001');
      // Remove default products that were overridden
      const overriddenIds = customProducts.map(p => p.id);
      const filteredDefaults = defaultProducts.filter(p => !overriddenIds.includes(p.id));

      setProducts([...customProducts, ...filteredDefaults]);
      setIsDialogOpen(false);
    } catch (e) {
      console.error("Error saving product", e);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sản phẩm</h1>
        <Button
          onClick={() => handleOpenDialog()}
          className="rounded-none bg-black hover:bg-black/90 font-bold uppercase tracking-widest flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm sản phẩm
        </Button>
      </div>

      <div className="bg-white border border-black/10 overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow className="border-black/10 hover:bg-transparent">
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50">Sản phẩm</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50">SKU</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50">Giá bán</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50">Trạng thái</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id} className="border-black/10">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F5F2EE] overflow-hidden shrink-0">
                      {product.imageUrls?.[0] ? (
                        <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black/5 text-black/20">
                          <UploadCloud className="size-4" />
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-sm min-w-[120px] line-clamp-2">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-mono whitespace-nowrap">{product.sku}</TableCell>
                <TableCell className="text-sm font-bold font-mono text-[#A0522D] whitespace-nowrap">{product.price.toLocaleString()}đ</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                    In Stock
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleOpenDialog(product)}
                    className="text-sm font-bold underline decoration-1 underline-offset-2 text-black/50 hover:text-black flex items-center gap-1 justify-end w-full whitespace-nowrap"
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
        <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-none border border-black/10">
          <DialogHeader>
            <DialogTitle className="font-semibold text-2xl uppercase font-medium">
              {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              {/* Image Upload Area */}
              <label className="block w-full aspect-video bg-[#F4F1EE] border border-dashed border-ink/20 flex flex-col items-center justify-center text-ink-muted cursor-pointer hover:bg-ink/5 transition-colors group relative overflow-hidden">
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="size-10 rounded-full bg-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                      <UploadCloud className="size-4 text-ink" />
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-widest font-bold">Upload Ảnh</p>
                  </>
                )}
              </label>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest font-bold text-ink">Tên Sản Phẩm</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ví dụ: Áo Sơ Mi"
                  className="rounded-none border-ink/10 bg-[#F4F1EE]/50 focus-visible:ring-0 focus-visible:border-ink"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest font-bold text-ink">Mã SKU</label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    className="rounded-none border-ink/10 bg-[#F4F1EE]/50 focus-visible:ring-0 focus-visible:border-ink font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest font-bold text-ink">Giá Bán (VNĐ)</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="rounded-none border-ink/10 bg-[#F4F1EE]/50 focus-visible:ring-0 focus-visible:border-ink font-mono text-[#A0522D] font-bold"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleSave}
              className="w-full bg-black hover:bg-black/90 text-white rounded-none uppercase font-mono tracking-widest text-[11px] h-12"
            >
              Lưu Sản Phẩm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
