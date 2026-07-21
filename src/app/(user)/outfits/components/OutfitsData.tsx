import { serverFetch } from "@/lib/server-fetch";
import { OutfitRes as Outfit } from "@/features/outfits/types";
import { OutfitsClient } from "./OutfitsClient";

export async function OutfitsData() {
  const outfits = await serverFetch<Outfit[]>("/me/outfits") || [];
  return <OutfitsClient initialOutfits={outfits} />;
}
