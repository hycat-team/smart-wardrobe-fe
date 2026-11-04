"use client";

import { Check, Copy, Loader2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { UserRes } from "@/features/admin/types";
import { formatAdminDate, shortenUuid } from "@/features/admin/utils/user-lookup";
import { UserPlanCell } from "./UserPlanCell";

export type UserDialogMode = "view" | "grant" | "cancel";

function isActiveStatus(status?: number | string) {
  return status === 0 || status === "ACTIVE";
}

export function UsersTable({
  users,
  isLoading,
  isError,
  isUpdating,
  emptyHint,
  onOpenUser,
  onToggleStatus,
}: {
  users: UserRes[];
  isLoading: boolean;
  isError: boolean;
  isUpdating: boolean;
  emptyHint?: string;
  onOpenUser: (userId: string, mode: UserDialogMode) => void;
  onToggleStatus: (id: string, currentStatus: number | string) => void;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyUserId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      toast.success("Đã sao chép mã người dùng");
      window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 2000);
    } catch {
      toast.error("Không sao chép được mã người dùng");
    }
  };

  const columnCount = 6;

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-b border-border">
          <TableHead className="h-auto w-[280px] py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Tài khoản
          </TableHead>
          <TableHead className="h-auto py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Gói hội viên
          </TableHead>
          <TableHead className="h-auto py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Vai trò
          </TableHead>
          <TableHead className="h-auto py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Ngày tham gia
          </TableHead>
          <TableHead className="h-auto py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Trạng thái
          </TableHead>
          <TableHead className="h-auto py-4 text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Thao tác
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={columnCount} className="h-32 border-b border-border text-center">
              <Loader2 className="mx-auto animate-spin text-muted-foreground" />
            </TableCell>
          </TableRow>
        ) : isError ? (
          <TableRow>
            <TableCell
              colSpan={columnCount}
              className="h-32 border-b border-border text-center text-[11px] font-semibold uppercase text-foreground"
            >
              Lỗi tải dữ liệu.
            </TableCell>
          </TableRow>
        ) : users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columnCount} className="h-32 border-b border-border text-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Không có dữ liệu.
              </p>
              {emptyHint && (
                <p className="mt-2 text-[11px] normal-case tracking-normal text-muted-foreground">
                  {emptyHint}
                </p>
              )}
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => {
            const displayName =
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              user.username ||
              "Người dùng";
            const isActive = isActiveStatus(user.status);
            const isAdmin = user.roleSlug === "admin";
            const hasPlan = !!user.subscription?.planName;

            return (
              <TableRow
                key={user.id}
                className={cn(
                  "border-b border-border transition-colors hover:bg-muted/50",
                  !isActive && "opacity-60"
                )}
              >
                <TableCell className="py-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-10 shrink-0">
                      <AvatarImage
                        src={user.avatarUrl || undefined}
                        alt={displayName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-muted text-base font-semibold text-foreground">
                        {displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-base font-medium text-foreground">
                        {displayName}
                      </span>
                      <span className="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {user.email}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyUserId(user.id)}
                        title={user.id}
                        className="mt-1 inline-flex w-fit items-center gap-1 font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {copiedId === user.id ? (
                          <Check className="size-3 text-emerald-600" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                        {shortenUuid(user.id)}
                      </button>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-5">
                  <UserPlanCell subscription={user.subscription} />
                </TableCell>

                <TableCell className="py-5">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest",
                      isAdmin
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-muted/50 text-muted-foreground"
                    )}
                  >
                    {isAdmin ? "ADMIN" : "USER"}
                  </span>
                </TableCell>

                <TableCell className="py-5 text-[12px] font-semibold text-muted-foreground">
                  {formatAdminDate(user.createdAt)}
                </TableCell>

                <TableCell className="py-5">
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-widest",
                      isActive
                        ? "border-foreground bg-foreground/5 text-foreground"
                        : "border-border bg-muted/50 text-muted-foreground"
                    )}
                  >
                    {isActive ? "ACTIVE" : "BANNED"}
                  </span>
                </TableCell>

                <TableCell className="py-5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground"
                        aria-label={`Thao tác cho ${displayName}`}
                      >
                        <MoreHorizontal className="size-4" strokeWidth={1.5} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-52 rounded-2xl border border-border bg-card p-2 text-[10px] font-semibold uppercase tracking-widest shadow-lg"
                    >
                      <DropdownMenuItem
                        className="cursor-pointer rounded-xl px-3 py-3 focus:bg-muted/50"
                        onClick={() => onOpenUser(user.id, "view")}
                      >
                        XEM CHI TIẾT
                      </DropdownMenuItem>
                      {!isAdmin && (
                        <DropdownMenuItem
                          className="cursor-pointer rounded-xl px-3 py-3 focus:bg-muted/50"
                          onClick={() => onOpenUser(user.id, "grant")}
                        >
                          CẤP GÓI
                        </DropdownMenuItem>
                      )}
                      {!isAdmin && hasPlan && (
                        <DropdownMenuItem
                          className="cursor-pointer rounded-xl px-3 py-3 text-destructive focus:bg-destructive/10"
                          onClick={() => onOpenUser(user.id, "cancel")}
                        >
                          HUỶ GÓI
                        </DropdownMenuItem>
                      )}
                      {!isAdmin && (
                        <>
                          <DropdownMenuSeparator className="bg-black/10" />
                          <DropdownMenuItem
                            className="cursor-pointer rounded-xl px-3 py-3 focus:bg-muted/50"
                            onClick={() => onToggleStatus(user.id, user.status ?? 0)}
                            disabled={isUpdating}
                          >
                            {isActive ? "KHOÁ TÀI KHOẢN" : "MỞ KHOÁ"}
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
