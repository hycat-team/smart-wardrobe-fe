"use client";

import { useEffect, useState } from "react";
import { useProfile } from "@/features/profile/queries/profile.queries";
import { useAuthStore } from "@/store/useAuthStore";


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
        isPremium: (!!profileData.subscription?.planSlug && profileData.subscription.planSlug !== "free") || 
                   (!!(profileData as any).planSlug && (profileData as any).planSlug !== "free")
      };
      setUser(userToStore);
    }
  }, [profileData, setUser]);

  useEffect(() => {
    // Check if the auth token is missing using our internal API status route
    // If it's missing (e.g. after a logout or token expiration), clear the user state.
    fetch('/api/auth/status')
      .then(res => res.json())
      .then(data => {
        if (!data || !data.hasToken) {
          setUser(null);
        }
      })
      .catch(() => {
        // If the API status check fails, assume no token
        setUser(null);
      });
  }, [isError, setUser]);

  // Optionally, you can return null while loading if you want to block rendering
  // but it's usually better to render children and let them handle loading states
  // or just show a global loader if needed.
  if (!mounted) return null;

  return <>{children}</>;
}
