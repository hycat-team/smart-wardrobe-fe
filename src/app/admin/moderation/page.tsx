import { Metadata } from "next";
import { ModerationClient } from "./components/ModerationClient";

export const metadata: Metadata = {
  title: "Kiểm duyệt nội dung | Smart Wardrobe",
  description: "Quản lý và kiểm duyệt nội dung cộng đồng.",
};

export default function ModerationPage() {
  return <ModerationClient />;
}
