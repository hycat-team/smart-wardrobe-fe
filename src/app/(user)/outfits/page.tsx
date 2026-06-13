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
  const outfits = await serverFetch<Outfit[]>("/me/outfits") || [];
  
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6 pt-24">
        <div className="size-16 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-ink-muted font-mono tracking-widest uppercase">Đang tải lookbook...</p>
      </div>
    }>
      <OutfitsClient initialOutfits={outfits} />
    </Suspense>
  );
}
