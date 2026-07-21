"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/features/profile/queries/profile.queries";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const isGuestRoute = pathname?.startsWith("/auth");
  const { data: profileData, isError, isLoading } = useProfile(undefined, !isGuestRoute);
  
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (profileData) {
      // Sync fetched profile data to global store
      // Populate mock backward compatible fields
      const userToStore = {
        ...profileData,
        name: profileData.firstName + (profileData.lastName ? ` ${profileData.lastName}` : ""),
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${profileData.username}`,
        isPremium: (!!profileData.subscription?.planSlug && profileData.subscription.planSlug !== "free") || 
                   (!!profileData.planSlug && profileData.planSlug !== "free")
      };
      setUser(userToStore);
    }
  }, [profileData, setUser]);

  useEffect(() => {
    if (isError) {
      setUser(null);
      
      const isPublicRoute = pathname === "/" || pathname?.startsWith("/auth");
      if (!isPublicRoute) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        router.push("/auth/login");
      }
    }
  }, [isError, setUser, pathname, router]);

  // Optionally, you can return null while loading if you want to block rendering
  // but it's usually better to render children and let them handle loading states
  // or just show a global loader if needed.

  return <>{children}</>;
}
