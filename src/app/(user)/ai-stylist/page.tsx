import { Metadata } from "next";
import { AIStylistClient } from "./components/AIStylistClient";

export const metadata: Metadata = {
  title: "AI Stylist | Smart Wardrobe",
  description: "Trợ lý ảo AI giúp bạn phối đồ mỗi ngày.",
};

export default function AIStylistPage() {
  return <AIStylistClient />;
}
