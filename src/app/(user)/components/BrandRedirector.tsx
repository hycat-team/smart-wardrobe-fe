"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
export function BrandRedirector() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    if (user && user.roleSlug === "user" && user.lastName?.toLowerCase() === "brand") {
      router.push("/brand/dashboard");
    }
  }, [user, router]);
  return null;
}
