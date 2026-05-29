"use client";

import { useEffect, useState } from "react";
import { useProfile } from "@/features/profile/queries/profile.queries";
import { useAuthStore } from "@/store/useAuthStore";
import Cookies from "js-cookie";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: profileData, isError, isLoading } = useProfile();
  const setUser = useAuthStore((state) => state.setUser);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (profileData) {
      // Sync fetched profile data to global store
      // Populate mock backward compatible fields
      const userToStore = {
        ...profileData,
        name: profileData.firstName + (profileData.lastName ? ` ${profileData.lastName}` : ""),
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${profileData.username}`,
        isPremium: !!profileData.subscription?.planId && profileData.subscription.planId !== "free"
      };
      setUser(userToStore);
    }
  }, [profileData, setUser]);

  useEffect(() => {
    // If the token is invalid or missing, we can clear the user state.
    // The Axios interceptor will also handle 401 and clear cookies.
    if (isError || !Cookies.get("accessToken")) {
      setUser(null);
    }
  }, [isError, setUser]);

  // Optionally, you can return null while loading if you want to block rendering
  // but it's usually better to render children and let them handle loading states
  // or just show a global loader if needed.
  if (!mounted) return null;

  return <>{children}</>;
}
