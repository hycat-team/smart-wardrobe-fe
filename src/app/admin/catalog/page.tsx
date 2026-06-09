import { Metadata } from "next";
import { CatalogClient } from "./components/CatalogClient";

export const metadata: Metadata = {
  title: "Catalog Hệ Thống | Smart Wardrobe Admin",
  description: "Quản lý danh mục trang phục mẫu của hệ thống.",
};

export default function AdminCatalogPage() {
  return <CatalogClient />;
}
