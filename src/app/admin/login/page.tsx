import { Metadata } from "next";
import { AdminLoginClient } from "./components/AdminLoginClient";

export const metadata: Metadata = {
  title: "Đăng nhập Quản trị viên | Smart Wardrobe",
  description: "Đăng nhập hệ thống quản trị.",
};

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
