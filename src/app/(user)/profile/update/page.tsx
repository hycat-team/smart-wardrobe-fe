import { Metadata } from "next";
import { serverFetch } from "@/lib/server-fetch";
import { UserRes } from "@/features/profile/types";
import { ProfileUpdateClient } from "../components/ProfileUpdateClient";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  title: "Cập nhật hồ sơ | Smart Wardrobe",
  description: "Cập nhật thông tin hồ sơ cá nhân.",
};
export default async function ProfileUpdatePage() {
  const initialProfile = await serverFetch<UserRes>("/me");
  if (!initialProfile) {
    redirect("/auth/login");
  }
  return <ProfileUpdateClient initialProfile={initialProfile} />;
}
