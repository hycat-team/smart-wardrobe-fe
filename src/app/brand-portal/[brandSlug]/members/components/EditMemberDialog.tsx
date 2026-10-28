"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useUpdateBrandMember } from "@/features/brand-portal/queries/brand-portal.queries";
import type { BrandMember } from "@/features/brand-portal/types";
import { memberDisplayEmail, memberDisplayName } from "./member-utils";

interface Props {
  brandId: string;
  member: BrandMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_OPTIONS = [
  { value: "active", label: "Đang hoạt động" },
  { value: "disabled", label: "Đã khóa" },
];

export default function EditMemberDialog({ brandId, member, open, onOpenChange }: Props) {
  const { mutateAsync: updateMember, isPending } = useUpdateBrandMember(brandId);
  const [status, setStatus] = useState<"active" | "disabled">("active");

  useEffect(() => {
    if (!open || !member) return;
    setStatus(member.status === "disabled" ? "disabled" : "active");
  }, [open, member?.id, member?.status]);

  const handleSave = async () => {
    if (!member) return;
    try {
      await updateMember({ memberId: member.id, status });
      onOpenChange(false);
    } catch {
      // toast handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thành viên</DialogTitle>
          <DialogDescription>
            Cập nhật trạng thái hoạt động của nhân viên trong thương hiệu.
          </DialogDescription>
        </DialogHeader>

        {member && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <p className="text-sm font-bold text-foreground">{memberDisplayName(member)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{memberDisplayEmail(member)}</p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Vai trò: {member.role === "owner" ? "Quản trị viên" : "Nhân viên"}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                Trạng thái
              </label>
              <Select value={status} onValueChange={(value) => setStatus((value as "active" | "disabled") ?? "active")}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue>
                    {(value) => STATUS_OPTIONS.find((option) => option.value === value)?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Nhân viên bị khóa sẽ không thể truy cập không gian thương hiệu cho đến khi được mở lại.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" className="rounded-full" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button className="rounded-full" onClick={handleSave} disabled={isPending || !member}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
