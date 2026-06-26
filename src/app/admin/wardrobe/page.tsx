import { Metadata } from "next";
import { SystemWardrobeClient } from "./components/SystemWardrobeClient"; export const metadata: Metadata = { title: "Trang Phục Hệ Thống | Smart Wardrobe Admin", description: "Quản lý trang phục mẫu của hệ thống.",
}; export default function AdminWardrobePage() { return <SystemWardrobeClient />;
} 