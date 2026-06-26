import { Metadata } from "next";
import { MyListingsClient } from "./components/MyListingsClient";
export const metadata: Metadata = {
  title: "Đơn bán của tôi | Smart Wardrobe",
  description: "Quản lý các sản phẩm bạn đang đăng bán.",
};
export default function MyListingsPage() {
  return <MyListingsClient />;
}
