import { Metadata } from "next";
import { RegisterClient } from "./components/RegisterClient";

export const metadata: Metadata = {
  title: "Đăng ký | Closy",
  description: "Tạo tài khoản Closy mới.",
};

export default function RegisterPage() {
  return <RegisterClient />;
}
