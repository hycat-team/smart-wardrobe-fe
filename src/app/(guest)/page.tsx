import { Metadata } from "next";
import { LandingClient } from "./components/LandingClient";
export const metadata: Metadata = {
  title: "Closy | AI Fashion Stylist — Tủ Đồ Thông Minh",
  description:
    "Số hoá tủ đồ, nhận gợi ý phối outfit từ AI và kết nối cộng đồng thời trang Gen Z. Miễn phí, chỉ mất 30 giây.",
  keywords: [
    "closy",
    "smart wardrobe",
    "tủ đồ thông minh",
    "ai stylist",
    "phối đồ",
    "thời trang",
    "gen z",
    "outfit",
  ],
  openGraph: {
    title: "Closy | AI Fashion Stylist — Tủ Đồ Thông Minh",
    description:
      "Số hoá tủ đồ, nhận gợi ý phối outfit từ AI và kết nối cộng đồng thời trang Gen Z.",
    type: "website",
    locale: "vi_VN",
  },
};
export default function LandingPage() {
  return <LandingClient />;
}
