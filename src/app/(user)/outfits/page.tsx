import { Metadata } from "next";
import { Suspense } from "react";
import { serverFetch } from "@/lib/server-fetch";
import { OutfitRes as Outfit } from "@/features/outfits/types";
import { OutfitsClient } from "./components/OutfitsClient";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Bộ trang phục (Outfits) | Smart Wardrobe",
  description: "Quản lý các bộ trang phục của bạn.",
};

export default async function OutfitsPage() {
  const outfits = await serverFetch<Outfit[]>("/outfits") || [];
  
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-10 text-terracotta animate-spin" />
        <p className="text-sm text-ink-muted font-mono">Đang tải danh sách phối đồ...</p>
      </div>
    }>
      <OutfitsClient initialOutfits={outfits} />
    </Suspense>
  );
}
