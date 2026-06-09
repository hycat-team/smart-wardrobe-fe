import { Metadata } from "next";
import { DashboardClient } from "./components/DashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard | Smart Wardrobe",
  description: "Dashboard tổng quan quản trị hệ thống.",
};

export default function AdminDashboardPage() {
  return <DashboardClient />;
}
