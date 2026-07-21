import { serverFetch } from "@/lib/server-fetch";
import { WardrobeItemRes as WardrobeItem } from "@/features/wardrobe/types";
import { WardrobeItemEditClient } from "../../components/WardrobeItemEditClient";

export async function WardrobeItemEditData({ id }: { id: string }) {
  const item = await serverFetch<WardrobeItem>(`/wardrobe-items/${id}`);
  
  return <WardrobeItemEditClient itemId={id} initialItem={item || undefined} />;
}
