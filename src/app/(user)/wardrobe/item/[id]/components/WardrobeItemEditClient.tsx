"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  useWardrobeItemDetail,
  useUpdateWardrobeItem,
  useCategories,
} from "@/features/wardrobe/queries/wardrobe.queries";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { applyCloudinaryTrim } from "@/lib/cloudinary";
import {
  UpdateWardrobeItemReq,
  WardrobeItemRes as WardrobeItem,
} from "@/features/wardrobe/types";

interface WardrobeItemEditClientProps {
  itemId: string;
  initialItem?: WardrobeItem;
}

export function WardrobeItemEditClient({
  itemId,
  initialItem,
}: WardrobeItemEditClientProps) {
  const router = useRouter();

  const {
    data: item,
    isLoading,
    error,
  } = useWardrobeItemDetail(itemId, initialItem);
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
    },
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
        <Loader2 className="size-8 animate-spin text-foreground" />
        <p className="text-sm font-semibold text-muted-foreground animate-pulse">
          Äang táº£i thÃ´ng tin trang phá»¥c...
        </p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center max-w-md mx-auto">
        <AlertCircle className="size-12 text-destructive/80" />
        <h2 className="text-xl font-semibold text-foreground">
          KhÃ´ng tÃ¬m tháº¥y trang phá»¥c
        </h2>
        <button
          onClick={() => router.push("/wardrobe")}
          className="mt-4 rounded-full border border-border px-6 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground transition-all duration-200 hover:bg-muted"
        >
          QUAY Láº I Tá»¦ Äá»’
        </button>
      </div>
    );
  }

  const onSubmit = (data: UpdateWardrobeItemReq) => {
    updateItem(
      { id: itemId, data },
      {
        onSuccess: () => {
          router.push(`/wardrobe/item/${itemId}`);
        },
      },
    );
  };

  return (
    <div className="flex-1 min-h-screen bg-background text-foreground pb-24 md:pb-12">
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
            áº¢nh trang phá»¥c khÃ´ng thá»ƒ thay Ä‘á»•i
          </p>
        </div> */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start"
        >
          {/* Left Column: Minimal Image Area */}
          <div className="image-frame lg:col-span-5 relative w-full aspect-[3/4] p-8 md:p-12 transition-all duration-200">
            <Image
              src={applyCloudinaryTrim(item.imageUrl)}
              alt="Preview"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-contain drop-shadow-sm"
            />
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
              <span className="rounded-full bg-primary px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-primary-foreground">
                Sửa món đồ
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Form Area */}
          <div className="lg:col-span-7 flex flex-col gap-10 md:gap-16 pt-4 lg:pt-8">
            <h1 className="text-4xl font-semibold leading-[1.1] text-foreground md:text-5xl">
              Chỉnh sửa thông tin
            </h1>

            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Category */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Danh mục
                  </label>
                  <select
                    {...register("categoryId")}
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 text-[12px] text-foreground transition-all duration-200 outline-none appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Giá tiền (VNĐ)
                  </label>
                  <input
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 text-[12px] text-foreground transition-all duration-200 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="VD: 500000"
                  />
                </div>

                {/* Color */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Màu sắc
                  </label>
                  <input
                    {...register("color")}
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 text-[12px] text-foreground transition-all duration-200 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="VD: Trắng"
                  />
                </div>

                {/* Material */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Chất liệu
                  </label>
                  <input
                    {...register("material")}
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 text-[12px] text-foreground transition-all duration-200 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="VD: Cotton"
                  />
                </div>

                {/* Fit */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Kiểu dáng (Fit)
                  </label>
                  <input
                    {...register("fit")}
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 text-[12px] text-foreground transition-all duration-200 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="VD: Regular"
                  />
                </div>

                {/* Pattern */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Họa tiết
                  </label>
                  <input
                    {...register("pattern")}
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 text-[12px] text-foreground transition-all duration-200 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="VD: Trơn"
                  />
                </div>

                {/* Seasonality */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Mùa (Seasonality)
                  </label>
                  <input
                    {...register("seasonality")}
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 text-[12px] text-foreground transition-all duration-200 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="VD: Summer"
                  />
                </div>
              </div>

              {/* Style */}
              <div className="flex flex-col gap-2 mt-4">
                <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Phong cách (Style Tags)
                </label>
                <input
                  {...register("style")}
                  className="h-12 w-full rounded-xl border border-input bg-background px-4 text-[12px] text-foreground transition-all duration-200 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="VD: Casual, Minimalist"
                />
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Ngăn cách các thẻ bằng dấu phẩy (,)
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto flex gap-4 border-t border-border pt-8">
              <button
                type="button"
                onClick={() => router.push(`/wardrobe/item/${itemId}`)}
                className="flex-1 rounded-full border border-border py-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground transition-all duration-200 outline-none hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-4 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground transition-all duration-200 outline-none hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:bg-primary/50"
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Lưu thay đổi
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
