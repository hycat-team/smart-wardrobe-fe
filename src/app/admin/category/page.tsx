import { Metadata } from "next";
import { CategoryClient } from "./components/CategoryClient";
export const metadata: Metadata = {
  title: "Admin Category | Smart Wardrobe",
  description: "Quản lý danh mục hệ thống.",
};
export default function AdminCategoryPage() {
  return <CategoryClient />;
}
