import { Metadata } from "next";
import { Suspense } from "react";
import { OutfitsData } from "./components/OutfitsData";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Bộ trang phục (Outfits) | Smart Wardrobe",
  description: "Quản lý các bộ trang phục của bạn.",
};

export default function OutfitsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <OutfitsData />
    </Suspense>
  );
}
