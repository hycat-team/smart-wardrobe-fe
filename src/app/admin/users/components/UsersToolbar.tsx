"use client";

import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type RoleFilter = "user" | "admin" | "all";
export type StatusFilter = "all" | "active" | "banned";

const ROLE_OPTIONS: { value: RoleFilter; label: string }[] = [
  { value: "user", label: "Người dùng" },
  { value: "admin", label: "Quản trị" },
  { value: "all", label: "Tất cả vai trò" },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang hoạt động" },
  { value: "banned", label: "Bị khoá" },
];

export function UsersToolbar({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
  isSearchingById,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  role: RoleFilter;
  onRoleChange: (value: RoleFilter) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  isSearchingById: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="TÌM TÊN, EMAIL HOẶC DÁN MÃ NGƯỜI DÙNG..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-10 w-full rounded-2xl border border-border bg-muted/50 pl-10 pr-10 text-[11px] font-semibold uppercase tracking-widest text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Xoá nội dung tìm kiếm"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            items={ROLE_OPTIONS}
            value={role}
            onValueChange={(value) => onRoleChange(value as RoleFilter)}
          >
            <SelectTrigger className="h-9 min-w-40 text-xs" aria-label="Lọc theo vai trò">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            items={STATUS_OPTIONS}
            value={status}
            onValueChange={(value) => onStatusChange(value as StatusFilter)}
          >
            <SelectTrigger className="h-9 min-w-40 text-xs" aria-label="Lọc theo trạng thái">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isSearchingById && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-foreground/30 bg-foreground/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground">
            Đang lọc theo mã người dùng
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Tìm kiếm văn bản được bỏ qua khi có mã UUID
          </span>
        </div>
      )}
    </div>
  );
}
