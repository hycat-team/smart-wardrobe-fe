import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Gender } from "@/common/enum"
import { UserRes } from "@/features/profile/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUserAvatar(user: UserRes | null | undefined): string {
  if (!user) return "/images-male.png";
  if (user.avatarUrl) return user.avatarUrl;
  
  if (user.gender === Gender.Female) {
    return "/images-female.png";
  }
  
  // Default for Male, Other or Unknown
  return "/images-male.png";
}
