"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  useWardrobeItemDetail,
  useUpdateWardrobeItem,
  useCategories
} from "@/features/wardrobe/queries/wardrobe.queries";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { UpdateWardrobeItemReq, WardrobeItemRes as WardrobeItem } from "@/features/wardrobe/types";
import { applyCloudinaryTrim } from "@/lib/cloudinary";
import { UpdateWardrobeItemReq, WardrobeItemRes as WardrobeItem, WardrobeItemStatus } from "@/features/wardrobe/types";
import Image from "next/image";

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
      categoryId: "",
      color: "",
      fit: "",
      material: "",
      pattern: "",
      seasonality: "",
      style: "",
      price: undefined,
    }
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (item) {
      reset({
        categoryId: item.category?.id || "",
        color: item.color || "",
        fit: item.fit || "",
        material: item.material || "",
        pattern: item.pattern || "",
        seasonality: item.seasonality || "",
        style: item.style || "",
        price: item.price || undefined,
      });
    }
  }, [item, reset]);

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
        <button onClick={() => router.push("/wardrobe")} className="mt-4 border border-[#E5E5E5] px-6 py-3 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-[#666] hover:bg-[#F8F7F5] transition-colors">
          QUAY LẠI TỦ ĐỒ
        </button>
      </div>
    );
  }

  const onSubmit = (data: UpdateWardrobeItemReq) => {
    updateItem({ id: itemId, data }, {
      onSuccess: () => {
        router.push(`/wardrobe/item/${itemId}`);
      }
    });
  };

  return (
    <div className="flex-1 min-h-screen bg-white text-[#111] pb-24 md:pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col pt-8 lg:pt-12">

        {/* Left Column: Image Preview */}
        {/* <div className="md:col-span-5 flex flex-col gap-4">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-sm border border-cream-dark/50 bg-cream-dark/20">
            <Image
              src={item.imageUrl}
              alt="Preview"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-[10px] font-mono text-ink-muted text-center uppercase tracking-widest">
            Ảnh trang phục không thể thay đổi
          </p>
        </div> */}

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

          {/* Left Column: Minimal Image Area */}
          <div className="lg:col-span-5 relative w-full aspect-[3/4] bg-[#F7F6F4] p-8 md:p-12 transition-all duration-700">
            <img
              src={applyCloudinaryTrim(item.imageUrl)}
              alt="Preview"
              className="w-full h-full object-contain drop-shadow-sm"
            />
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
              <span className="bg-[#111] text-white px-3 py-1.5 font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.12em]">
                EDIT MODE
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Form Area */}
          <div className="lg:col-span-7 flex flex-col gap-10 md:gap-16 pt-4 lg:pt-8">
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium text-[#111] leading-[1.1]">
              Chỉnh sửa thông tin
            </h1>

            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Category */}
                <div className="flex flex-col gap-2">
                  <label className="font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-[0.12em] text-[#888]">Danh mục</label>
                  <select
                    {...register("categoryId")}
                    className="w-full h-12 border-b border-black/10 bg-transparent focus:border-black outline-none font-['IBM_Plex_Mono'] text-[12px] text-[#111] transition-colors appearance-none rounded-none"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="flex flex-col gap-2">
                  <label className="font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-[0.12em] text-[#888]">Giá tiền (VNĐ)</label>
                  <input
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    className="w-full h-12 border-b border-black/10 bg-transparent focus:border-black outline-none font-['IBM_Plex_Mono'] text-[12px] text-[#111] transition-colors rounded-none"
                    placeholder="VD: 500000"
                  />
                </div>

                {/* Color */}
                <div className="flex flex-col gap-2">
                  <label className="font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-[0.12em] text-[#888]">Màu sắc</label>
                  <input
                    {...register("color")}
                    className="w-full h-12 border-b border-black/10 bg-transparent focus:border-black outline-none font-['IBM_Plex_Mono'] text-[12px] text-[#111] transition-colors rounded-none"
                    placeholder="VD: Trắng"
                  />
                </div>

                {/* Material */}
                <div className="flex flex-col gap-2">
                  <label className="font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-[0.12em] text-[#888]">Chất liệu</label>
                  <input
                    {...register("material")}
                    className="w-full h-12 border-b border-black/10 bg-transparent focus:border-black outline-none font-['IBM_Plex_Mono'] text-[12px] text-[#111] transition-colors rounded-none"
                    placeholder="VD: Cotton"
                  />
                </div>

                {/* Fit */}
                <div className="flex flex-col gap-2">
                  <label className="font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-[0.12em] text-[#888]">Kiểu dáng (Fit)</label>
                  <input
                    {...register("fit")}
                    className="w-full h-12 border-b border-black/10 bg-transparent focus:border-black outline-none font-['IBM_Plex_Mono'] text-[12px] text-[#111] transition-colors rounded-none"
                    placeholder="VD: Regular"
                  />
                </div>

                {/* Pattern */}
                <div className="flex flex-col gap-2">
                  <label className="font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-[0.12em] text-[#888]">Họa tiết</label>
                  <input
                    {...register("pattern")}
                    className="w-full h-12 border-b border-black/10 bg-transparent focus:border-black outline-none font-['IBM_Plex_Mono'] text-[12px] text-[#111] transition-colors rounded-none"
                    placeholder="VD: Trơn"
                  />
                </div>

                {/* Seasonality */}
                <div className="flex flex-col gap-2">
                  <label className="font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-[0.12em] text-[#888]">Mùa (Seasonality)</label>
                  <input
                    {...register("seasonality")}
                    className="w-full h-12 border-b border-black/10 bg-transparent focus:border-black outline-none font-['IBM_Plex_Mono'] text-[12px] text-[#111] transition-colors rounded-none"
                    placeholder="VD: Summer"
                  />
                </div>
              </div>

              {/* Style */}
              <div className="flex flex-col gap-2 mt-4">
                <label className="font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-[0.12em] text-[#888]">Phong cách (Style Tags)</label>
                <input
                  {...register("style")}
                  className="w-full h-12 border-b border-black/10 bg-transparent focus:border-black outline-none font-['IBM_Plex_Mono'] text-[12px] text-[#111] transition-colors rounded-none"
                  placeholder="VD: Casual, Minimalist"
                />
                <p className="text-[10px] font-['IBM_Plex_Mono'] text-[#888] uppercase tracking-widest mt-1">Ngăn cách các thẻ bằng dấu phẩy (,)</p>
              </div>

            </div>

            {/* Actions */}
            <div className="pt-8 border-t border-black/10 flex gap-4 mt-auto">
              <button
                type="button"
                onClick={() => router.push(`/wardrobe/item/${itemId}`)}
                className="flex-1 py-4 border border-[#E5E5E5] text-[#666] font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest hover:bg-[#F8F7F5] transition-colors outline-none"
              >
                HỦY
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 py-4 bg-[#111] text-white font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest hover:bg-black/90 transition-colors flex items-center justify-center gap-2 outline-none disabled:bg-[#111]/50"
              >
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                LƯU THAY ĐỔI
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
