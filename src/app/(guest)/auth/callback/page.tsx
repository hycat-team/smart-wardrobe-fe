import { Suspense } from "react";
import { Metadata } from "next";
import { CallbackClient } from "./components/CallbackClient";
import { CallbackLoadingCard } from "./components/CallbackLoadingCard";

export const metadata: Metadata = {
  title: "Đang xác thực | Closy",
  description: "Đang xử lý đăng nhập Google vào hệ thống Closy.",
};

export default function GoogleAuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackLoadingCard />}>
      <CallbackClient />
    </Suspense>
  );
}
