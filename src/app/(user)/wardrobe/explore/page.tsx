import { Metadata } from "next";
import { SystemCatalogClient } from "./components/SystemCatalogClient";
export const metadata: Metadata = {
  title: "Khám Phá Tủ Đồ - Smart Wardrobe",
  description: "Khám phá và thêm nhanh trang phục từ tủ đồ hệ thống",
};
export default function SystemCatalogPage() {
  return <SystemCatalogClient />;
}
