import { Metadata } from "next";
import { serverFetch } from "@/lib/server-fetch";
import { WardrobeItemRes as WardrobeItem } from "@/features/wardrobe/types";
import { WardrobeItemEditClient } from "../components/WardrobeItemEditClient";

export const metadata: Metadata = {
  title: "Chỉnh sửa trang phục | Smart Wardrobe",
  description: "Chỉnh sửa thông tin chi tiết trang phục của bạn.",
};

export default async function WardrobeItemEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await serverFetch<WardrobeItem>(`/wardrobe-items/${id}`);
  
  return <WardrobeItemEditClient itemId={id} initialItem={item || undefined} />;
}
