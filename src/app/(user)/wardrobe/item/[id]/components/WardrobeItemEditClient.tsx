"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { 
  useWardrobeItemDetail, 
  useUpdateWardrobeItem,
  useCategories
} from "@/features/wardrobe/queries/wardrobe.queries";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { UpdateWardrobeItemReq, WardrobeItemRes as WardrobeItem, WardrobeItemStatus } from "@/features/wardrobe/types";

interface WardrobeItemEditClientProps {
  itemId: string;
  initialItem?: WardrobeItem;
}

export function WardrobeItemEditClient({ itemId, initialItem }: WardrobeItemEditClientProps) {
  const router = useRouter();

  const { data: item, isLoading, error } = useWardrobeItemDetail(itemId, initialItem);
  const { mutate: updateItem, isPending } = useUpdateWardrobeItem();
  const { data: categories = [] } = useCategories();

  const { handleSubmit, reset, register } = useForm<UpdateWardrobeItemReq>({
    defaultValues: {
      name: "",
      categoryId: "",
      color: "",
      fit: "",
      material: "",
      pattern: "",
      seasonality: "",
      style: "",
    }
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (item) {
      reset({
        name: item.category?.name || "Trang phục",
        categoryId: item.category?.id || "",
        color: item.color || "",
        fit: item.fit || "",
        material: item.material || "",
        pattern: item.pattern || "",
        seasonality: item.seasonality || "",
        style: item.style || "",
      });
    }
  }, [item, reset]);

  if (isLoading && !item) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="size-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center max-w-md mx-auto">
        <AlertCircle className="size-12 text-red-500/80" />
        <h2 className="text-xl font-heading font-semibold text-ink">Không tìm thấy trang phục</h2>
        <Button onClick={() => router.push("/wardrobe")} variant="outline" className="mt-4 rounded-xl font-mono">
          QUAY LẠI TỦ ĐỒ
        </Button>
      </div>
    );
  }

  const onSubmit = (data: UpdateWardrobeItemReq) => {
    updateItem({ id: itemId, data }, {
      onSuccess: () => {
        // Sau khi lưu xong thì quay về trang Detail
        router.push(`/wardrobe/item/${itemId}`);
      }
    });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 pb-20 max-w-4xl mx-auto">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-8 border-b border-cream-dark pb-6">
        <button 
          onClick={() => router.push(`/wardrobe/item/${itemId}`)}
          className="flex items-center gap-2 text-sm font-mono text-ink-muted hover:text-ink transition-colors group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" /> 
          HỦY CHỈNH SỬA
        </button>
        <h1 className="text-2xl font-heading font-medium tracking-wide text-ink absolute left-1/2 -translate-x-1/2 hidden md:block">
          Chỉnh sửa thông tin
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        
        {/* Left Column: Image Preview */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-sm border border-cream-dark/50 bg-cream-dark/20">
            <img 
              src={item.imageUrl} 
              alt="Preview" 
              className="w-full h-full object-cover" 
            />
          </div>
          <p className="text-[10px] font-mono text-ink-muted text-center uppercase tracking-widest">
            Ảnh trang phục không thể thay đổi
          </p>
        </div>

        {/* Right Column: Form Fields */}
        <div className="md:col-span-7 flex flex-col gap-6">
          
          {/* Tên trang phục */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-ink uppercase tracking-wider">Tên trang phục</label>
            <input 
              {...register("name")}
              className="w-full h-12 px-4 rounded-xl border border-cream-dark bg-transparent focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none transition-all font-sans text-ink"
              placeholder="VD: Áo Thun Trắng Nam"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-ink uppercase tracking-wider">Danh mục</label>
              <select 
                {...register("categoryId")}
                className="w-full h-12 px-4 rounded-xl border border-cream-dark bg-transparent focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none transition-all font-sans text-ink appearance-none"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-ink uppercase tracking-wider">Màu sắc</label>
              <input 
                {...register("color")}
                className="w-full h-12 px-4 rounded-xl border border-cream-dark bg-transparent focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none transition-all font-sans text-ink"
                placeholder="VD: Trắng"
              />
            </div>

            {/* Material */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-ink uppercase tracking-wider">Chất liệu</label>
              <input 
                {...register("material")}
                className="w-full h-12 px-4 rounded-xl border border-cream-dark bg-transparent focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none transition-all font-sans text-ink"
                placeholder="VD: Cotton"
              />
            </div>

            {/* Fit */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-ink uppercase tracking-wider">Kiểu dáng (Fit)</label>
              <input 
                {...register("fit")}
                className="w-full h-12 px-4 rounded-xl border border-cream-dark bg-transparent focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none transition-all font-sans text-ink"
                placeholder="VD: Regular"
              />
            </div>

            {/* Pattern */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-ink uppercase tracking-wider">Họa tiết</label>
              <input 
                {...register("pattern")}
                className="w-full h-12 px-4 rounded-xl border border-cream-dark bg-transparent focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none transition-all font-sans text-ink"
                placeholder="VD: Trơn"
              />
            </div>

            {/* Seasonality */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-ink uppercase tracking-wider">Mùa</label>
              <input 
                {...register("seasonality")}
                className="w-full h-12 px-4 rounded-xl border border-cream-dark bg-transparent focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none transition-all font-sans text-ink"
                placeholder="VD: Summer"
              />
            </div>
          </div>

          {/* Style */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-ink uppercase tracking-wider">Phong cách (Style)</label>
            <input 
              {...register("style")}
              className="w-full h-12 px-4 rounded-xl border border-cream-dark bg-transparent focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none transition-all font-sans text-ink"
              placeholder="VD: Casual, Minimalist"
            />
            <p className="text-[10px] text-ink-muted">Ngăn cách các thẻ bằng dấu phẩy (,)</p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-6 border-t border-cream-dark flex gap-4 justify-end">
            <Button 
              type="button"
              variant="ghost" 
              onClick={() => router.push(`/wardrobe/item/${itemId}`)}
              className="rounded-xl font-mono"
            >
              HỦY
            </Button>
            <Button 
              type="submit"
              disabled={isPending}
              className="bg-terracotta text-cream hover:bg-terracotta/90 rounded-xl px-8 font-mono shadow-sm"
            >
              {isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
              LƯU THAY ĐỔI
            </Button>
          </div>

        </div>
      </form>
    </div>
  );
}
