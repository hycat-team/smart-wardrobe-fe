"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileApi } from "@/features/profile/api/profile.api";
import { PROFILE_QUERY_KEY } from "@/features/profile/queries/profile.queries";
import {
  getAndClearReturnUrl,
  isValidReturnUrl,
  mapGoogleAuthError,
} from "@/features/auth/utils/google-auth.utils";
import { CallbackLoadingCard } from "./CallbackLoadingCard";

export function CallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const hasExecutedRef = useRef(false);

  const [statusText, setStatusText] = useState("Đang hoàn tất đăng nhập...");
  const [subStatusText, setSubStatusText] = useState(
    "Vui lòng đợi trong giây lát, Closy đang xác thực phiên làm việc của bạn."
  );

  useEffect(() => {
    // Ensure the effect only runs once even with React StrictMode
    if (hasExecutedRef.current) return;
    hasExecutedRef.current = true;

    const errorParam = searchParams.get("error");

    // 1. Kịch bản có lỗi từ Google hoặc Backend OAuth
    if (errorParam) {
      const mapped = mapGoogleAuthError(errorParam);
      setStatusText("Đăng nhập không thành công");
      setSubStatusText(mapped.message);

      if (mapped.type === "info") {
        toast.info(mapped.message);
      } else {
        toast.error(mapped.message);
      }

      // Điều hướng về trang đăng nhập và loại bỏ query khỏi lịch sử
      router.replace("/auth/login");
      return;
    }

    // 2. Kịch bản thành công: Gọi API xác thực phiên và hồ sơ
    async function verifySessionAndRedirect() {
      try {
        setStatusText("Đang đồng bộ hồ sơ...");
        setSubStatusText("Đang tải thông tin tài khoản của bạn.");

        // Gọi profileApi (đã kèm HttpOnly cookie vừa được backend set)
        const profile = await profileApi.getProfile();

        // Cập nhật và làm mới cache của React Query
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["authStatus"] }),
          queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
        ]);

        toast.success("Đăng nhập bằng Google thành công!");

        // Kiểm tra xem trước đó người dùng có trang đích nào được lưu không
        const savedReturnUrl = getAndClearReturnUrl();

        if (savedReturnUrl && isValidReturnUrl(savedReturnUrl)) {
          router.replace(savedReturnUrl);
          return;
        }

        // Điều hướng theo vai trò người dùng
        const role = (profile?.roleSlug || "").toUpperCase();
        if (role === "ADMIN") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/brands");
        }
      } catch (err: any) {
        console.error("Lỗi xác nhận phiên callback:", err);
        setStatusText("Xác thực thất bại");
        setSubStatusText("Không thể xác nhận phiên đăng nhập. Vui lòng thử lại.");
        toast.error("Không thể xác nhận phiên đăng nhập. Vui lòng đăng nhập lại.");
        router.replace("/auth/login");
      }
    }

    verifySessionAndRedirect();
  }, [router, searchParams, queryClient]);

  return (
    <CallbackLoadingCard
      message={statusText}
      subMessage={subStatusText}
    />
  );
}
