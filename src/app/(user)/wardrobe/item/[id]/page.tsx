import { Metadata } from "next";
import { serverFetch } from "@/lib/server-fetch";
import { WardrobeItemRes as WardrobeItem } from "@/features/wardrobe/types";
import { WardrobeItemDetailClient } from "./components/WardrobeItemDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await serverFetch<WardrobeItem>(`/wardrobe-items/${id}`);
  console.log(item)
  if (!item) {
    return {
      title: "Không tìm thấy trang phục | Smart Wardrobe",
    };
  }

  const itemName = item.category?.name 
    ? `${item.category.name} ${item.color || ""} ${item.style || ""}`.trim()
    : "Trang phục chưa phân loại";

  return {
    title: `${itemName} | Chi tiết tủ đồ`,
    description: `Chi tiết trang phục ${itemName} trong tủ đồ của bạn.`,
    openGraph: {
      images: [item.imageUrl],
    }
  };
}

export default async function WardrobeItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await serverFetch<WardrobeItem>(`/wardrobe-items/${id}`);
  
  return <WardrobeItemDetailClient itemId={id} initialItem={item || undefined} />;
}
