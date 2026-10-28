"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useGetBrandMembers, useRemoveBrandMember } from "@/features/brand-portal/queries/brand-portal.queries";
import { Loader2, Plus, Users, Mail, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AddMemberDialog from "./AddMemberDialog";
import EditMemberDialog from "./EditMemberDialog";
import { memberDisplayEmail, memberDisplayName, memberStatusLabel } from "./member-utils";
import { useBrandRole } from "@/features/brand-portal/context/BrandRoleContext";
import type { BrandMember } from "@/features/brand-portal/types";

export default function MembersClient() {
  const params = useParams();
  const brandId = params.brandSlug as string;
  const { isOwner, isLoading: isRoleLoading } = useBrandRole();
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<BrandMember | null>(null);
  const [removingMember, setRemovingMember] = useState<BrandMember | null>(null);

  const { data: members, isLoading } = useGetBrandMembers(brandId);
  const { mutateAsync: removeMember, isPending: isRemoving } = useRemoveBrandMember(brandId);

  const canManage = isOwner && !isRoleLoading;
  const columnCount = canManage ? 6 : 5;

  const handleRemove = async () => {
    if (!removingMember) return;
    try {
      await removeMember(removingMember.id);
      setRemovingMember(null);
    } catch {
      // toast handled by mutation
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold">Nhân sự thương hiệu</h2>
            <p className="text-xs text-muted-foreground">{members?.length || 0} thành viên</p>
          </div>
        </div>
        <Button className="rounded-full" onClick={() => setIsAddMemberDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Thêm thành viên
        </Button>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-bold text-[10px] uppercase tracking-widest">Thành viên</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest">Liên hệ</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest">Vai trò</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest">Trạng thái</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest">Ngày tham gia</TableHead>
                {canManage && (
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right">Thao tác</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columnCount} className="text-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : !members || members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columnCount} className="text-center py-20 text-muted-foreground">
                    <Users className="w-12 h-12 opacity-20 mx-auto mb-4" />
                    <p>Chưa có thành viên nào.</p>
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => {
                  const isMemberActive = member.status === "active";
                  const isBrandOwner = member.role === "owner";

                  return (
                    <TableRow key={member.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">{memberDisplayName(member)}</span>
                          <span className="text-xs text-muted-foreground">{member.user?.username || member.userId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" />
                          {memberDisplayEmail(member)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isBrandOwner ? "default" : "secondary"} className="uppercase tracking-widest text-[10px] font-bold">
                          {isBrandOwner ? "Quản trị viên" : "Nhân viên"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={isMemberActive ? "default" : "outline"}
                          className={`uppercase tracking-widest text-[10px] font-bold ${
                            isMemberActive ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-0" : ""
                          }`}
                        >
                          {memberStatusLabel(member.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(member.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      {canManage && (
                        <TableCell className="text-right">
                          {isBrandOwner ? (
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                              Chủ sở hữu
                            </span>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-full"
                                title="Chỉnh sửa thành viên"
                                onClick={() => setEditingMember(member)}
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-full text-destructive hover:text-destructive"
                                title="Xóa thành viên"
                                onClick={() => setRemovingMember(member)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddMemberDialog
        brandId={brandId}
        open={isAddMemberDialogOpen}
        onOpenChange={setIsAddMemberDialogOpen}
      />

      <EditMemberDialog
        brandId={brandId}
        member={editingMember}
        open={Boolean(editingMember)}
        onOpenChange={(open) => {
          if (!open) setEditingMember(null);
        }}
      />

      <AlertDialog
        open={Boolean(removingMember)}
        onOpenChange={(open) => {
          if (!open) setRemovingMember(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa thành viên?</AlertDialogTitle>
            <AlertDialogDescription>
              {removingMember ? `${memberDisplayName(removingMember)} sẽ mất quyền truy cập thương hiệu ngay lập tức.` : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleRemove();
              }}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
