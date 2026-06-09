import { Metadata } from "next";
import { Suspense } from "react";
import { serverFetch } from "@/lib/server-fetch";
import { OutfitRes as Outfit } from "@/features/outfits/types";
import { OutfitDetailClient } from "./components/OutfitDetailClient";
import { Loader2 } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const outfit = await serverFetch<Outfit>(`/outfits/${id}`);
  
  if (!outfit) {
    return {
      title: "Không tìm thấy bộ phối | Smart Wardrobe",
    };
  }

  return {
    title: `${outfit.name} | Chi tiết phối đồ`,
    description: `Chi tiết bộ phối đồ: ${outfit.name}.`,
    openGraph: {
      images: [outfit.cover_image_url || "/og-image.jpg"],
    }
  };
}

export default async function EditOutfitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const outfit = await serverFetch<Outfit>(`/outfits/${id}`);
  
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-10 text-terracotta animate-spin" />
        <p className="text-sm text-ink-muted font-mono">Đang tải bộ phối đồ...</p>
      </div>
    }>
      <OutfitDetailClient outfitId={id} initialOutfit={outfit || undefined} />
    </Suspense>
  );
}
