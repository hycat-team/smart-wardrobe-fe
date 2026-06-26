import CommunityClient from "./components/CommunityClient";
import { serverFetch } from "@/lib/server-fetch";
import { PaginationResult } from "@/types/api";
import { PostRes } from "@/features/community/types";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
export const metadata = {
  title: "Community | Smart Wardrobe",
  description: "Inspiration from conscious creators.",
};
export default async function CommunityPage() {
  // Fetch initial data on the server for SSR and SEO const initialData = await serverFetch<PaginationResult<PostRes>>('/posts?page=1&limit=10', { cache: 'no-store' }); return ( <Suspense fallback={ <div className="flex flex-col items-center justify-center min-h-[400px] gap-4"> <Loader2 className="size-10 text-primary animate-spin" /> <p className="text-sm text-muted-foreground font-sans">Đang tải bảng tin từ máy chủ...</p> </div> }> <CommunityClient initialData={initialData} /> </Suspense> );
}
