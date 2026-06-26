import WardrobeClient from "./components/WardrobeClient";
import { WardrobeItemRes } from "@/features/wardrobe/types";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { serverFetch } from "@/lib/server-fetch"; // Chuyển page.tsx thành Server Component (bỏ 'use client') export default async function WardrobePage() { // Tái sử dụng serverFetch, code giờ đây rất ngắn gọn và sạch const initialItems = await serverFetch<WardrobeItemRes[]>('/me/wardrobe-items', { cache: 'no-store' // Hoặc sử dụng revalidate tags tùy logic }); return ( <Suspense fallback={ <div className="flex flex-col items-center justify-center min-h-[400px] gap-4"> <Loader2 className="size-10 text-primary animate-spin" /> <p className="text-sm text-muted-foreground font-sans">Đang tải tủ đồ từ máy chủ...</p> </div> }> {/* Truyền dữ liệu lấy từ Server xuống Client Component */} <WardrobeClient initialData={initialItems || []} /> </Suspense> ); }
