import { Metadata } from "next";
import { UsersClient } from "./components/UsersClient";
export const metadata: Metadata = {
  title: "Quản Lý Người Dùng | Smart Wardrobe Admin",
  description: "Quản lý quyền truy cập và tài khoản người dùng.",
};
export default function AdminUsersPage() {
  return <UsersClient />;
}
