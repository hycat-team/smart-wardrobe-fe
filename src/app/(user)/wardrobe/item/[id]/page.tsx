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
    ? `${item.category.name} ${item.fashionItem?.color || (item as any).color || ""} ${item.fashionItem?.style || (item as any).style || ""}`.trim()
    : "Trang phục chưa phân loại";

  return {
    title: `${itemName} | Chi tiết tủ đồ`,
    description: `Chi tiết trang phục ${itemName} trong tủ đồ của bạn.`,
    openGraph: {
      images: [item.fashionItem?.imageUrl || (item as any).imageUrl],
    }
  };
}

import { Suspense } from 'react';
import { WardrobeItemData } from './components/WardrobeItemData';
import Loading from './loading';

export default async function WardrobeItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<Loading />}>
      <WardrobeItemData id={id} />
    </Suspense>
  );
}
