import { Metadata } from "next";
import { BrandProductsClient } from "./components/BrandProductsClient";
export const metadata: Metadata = { title: "Quản lý Sản phẩm | Không gian thương hiệu" };
export default function BrandProductsPage() {
  return <BrandProductsClient />;
}
