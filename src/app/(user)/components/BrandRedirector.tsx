"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { isBrandFeatureEnabled } from "@/lib/brand-feature";

export function BrandRedirector() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!isBrandFeatureEnabled()) return;
    if (user && user.roleSlug === 'user' && user.lastName?.toLowerCase() === 'brand') {
      router.push('/brand-portal');
    }
  }, [user, router]);

  return null;
}
