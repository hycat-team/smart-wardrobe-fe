"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function ThemeController({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user?.isPremium) {
      document.documentElement.classList.add("dark-atelier");
    } else {
      document.documentElement.classList.remove("dark-atelier");
    }
  }, [user]);

  return <>{children}</>;
}
