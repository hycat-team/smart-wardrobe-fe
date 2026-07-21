import { serverFetch } from "@/lib/server-fetch";
import { OutfitRes as Outfit } from "@/features/outfits/types";
import { OutfitsClient } from "./OutfitsClient";
import { PaginationResult } from "@/types/api";

export async function OutfitsData() {
  const initialData = await serverFetch<PaginationResult<Outfit>>("/me/outfits");
  return <OutfitsClient initialData={initialData} />;
}
