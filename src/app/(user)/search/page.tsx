import { Metadata } from "next";
import { Suspense } from "react";
import { SearchClient } from "./components/SearchClient";
import { Loader2 } from "lucide-react";
export const metadata: Metadata = {
  title: "Tìm kiếm | Smart Wardrobe",
  description: "Tìm kiếm trang phục, bài viết và người dùng trong Smart Wardrobe.",
};
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          {" "}
          <Loader2 className="size-10 text-terracotta animate-spin" />{" "}
          <p className="text-sm text-ink-muted font-sans">Đang tải tìm kiếm...</p>{" "}
        </div>
      }
    >
      {" "}
      <SearchClient />{" "}
    </Suspense>
  );
}
