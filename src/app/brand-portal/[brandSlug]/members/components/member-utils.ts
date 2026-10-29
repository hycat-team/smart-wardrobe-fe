import type { BrandMember } from "@/features/brand-portal/types";

export function memberDisplayName(member: BrandMember): string {
  const fullName = member.userFullName?.trim();
  if (fullName) return fullName;

  const nestedName = [member.user?.firstName, member.user?.lastName]
    .filter((part) => Boolean(part && part.trim()))
    .join(" ")
    .trim();
  if (nestedName) return nestedName;

  return member.user?.username || "Chưa cập nhật";
}

export function memberDisplayEmail(member: BrandMember): string {
  return member.userEmail || member.user?.email || "Chưa cập nhật";
}

export function memberStatusLabel(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
      return "Đang hoạt động";
    case "disabled":
      return "Đã khóa";
    case "invited":
      return "Đã mời";
    default:
      return status;
  }
}
