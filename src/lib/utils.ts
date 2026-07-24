import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { UserRes } from "@/features/profile/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUserAvatar(user: UserRes | null | undefined): string {
  if (!user) return "/avatar-default.jpg";
  if (user.avatarUrl) return user.avatarUrl;
  // Default for Male, Other or Unknown
  return "/avatar-default.jpg";
}
