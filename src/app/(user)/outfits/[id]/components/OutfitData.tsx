import { serverFetch } from "@/lib/server-fetch";
import { OutfitRes as Outfit } from "@/features/outfits/types";
import { OutfitDetailClient } from "./OutfitDetailClient";

export async function OutfitData({ id }: { id: string }) {
  const outfit = await serverFetch<Outfit>(`/outfits/${id}`);
  
  return <OutfitDetailClient outfitId={id} initialOutfit={outfit || undefined} />;
}
