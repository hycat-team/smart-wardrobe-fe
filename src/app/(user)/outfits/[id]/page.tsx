import { Metadata } from "next";
import { serverFetch } from "@/lib/server-fetch";
import { OutfitRes as Outfit } from "@/features/outfits/types";

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
      images: [outfit.coverImageUrl || "/og-image.jpg"],
    }
  };
}

import { Suspense } from "react";
import { OutfitData } from "./components/OutfitData";
import Loading from "./loading";

export default function EditOutfitPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Loading />}>
      <OutfitWrapper params={params} />
    </Suspense>
  );
}

// Extract wrapper component to await params
async function OutfitWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OutfitData id={id} />;
}
