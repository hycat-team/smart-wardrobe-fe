import { serverFetch } from "@/lib/server-fetch";
import { WardrobeItemRes as WardrobeItem } from "@/features/wardrobe/types";
import { WardrobeItemDetailClient } from "./WardrobeItemDetailClient";

export async function WardrobeItemData({ id }: { id: string }) {
  const item = await serverFetch<WardrobeItem>(`/wardrobe-items/${id}`);
  
  return <WardrobeItemDetailClient itemId={id} initialItem={item || undefined} />;
}
