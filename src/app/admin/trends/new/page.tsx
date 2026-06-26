import { Metadata } from "next";
import { NewTrendClient } from "./components/NewTrendClient";
export const metadata: Metadata = {
  title: "Đăng tải xu hướng | Smart Wardrobe",
  description: "Đăng tải xu hướng thời trang mới.",
};
export default function NewTrendPage() {
  return <NewTrendClient />;
}
