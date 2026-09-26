"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/features/profile/queries/profile.queries";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { cleanLegacyHostCookies } from "@/lib/auth-cleanup";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isGuestRoute = pathname?.startsWith("/auth");
  const { data: profileData, isError, isLoading } = useProfile(undefined, !isGuestRoute);

  const setUser = useAuthStore((state) => state.setUser);

  // Dọn dẹp tàn dư cookie host-only / storage legacy một lần khi khởi tạo
  useEffect(() => {
    cleanLegacyHostCookies();
  }, []);

  useEffect(() => {
    if (profileData) {
      // Sync fetched profile data to global store
      const userToStore = {
        ...profileData,
        name: profileData.firstName + (profileData.lastName ? ` ${profileData.lastName}` : ""),
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${profileData.username}`,
        isPremium:
          (!!profileData.subscription?.planSlug && profileData.subscription.planSlug !== "free") ||
          (!!profileData.planSlug && profileData.planSlug !== "free"),
      };
      setUser(userToStore);
    }
  }, [profileData, setUser]);

  useEffect(() => {
    if (isError) {
      setUser(null);
      cleanLegacyHostCookies();

      const isPublicRoute = pathname === "/" || pathname?.startsWith("/auth");
      if (!isPublicRoute) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        router.push("/auth/login");
      }
    }
  }, [isError, setUser, pathname, router]);

  return <>{children}</>;
}
