import { Metadata } from "next";
import { SellClient } from "./components/SellClient";
export const metadata: Metadata = {
  title: "Đăng bán trang phục | Smart Wardrobe",
  description: "Đăng bán trang phục của bạn trên Chợ Đồ Cũ.",
};
export default async function SellItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SellClient itemId={id} />;
}
