import { Metadata } from "next";
import PurchasesClient from "./components/PurchasesClient";
export const metadata: Metadata = {
  title: "Đơn hàng của tôi | Smart Wardrobe",
  description: "Quản lý đơn hàng và yêu cầu đổi trả",
};
export default function PurchasesPage() {
  return <PurchasesClient />;
}
