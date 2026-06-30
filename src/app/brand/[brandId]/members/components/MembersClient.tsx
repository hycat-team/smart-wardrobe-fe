"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetBrandMembers } from '@/features/brand-portal/queries/brand-portal.queries';
import { Loader2, Plus, Users, Mail, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AddMemberDialog from './AddMemberDialog';

export default function MembersClient() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);

  const { data: members, isLoading } = useGetBrandMembers(brandId);

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
          <Plus className="w-4 h-4 mr-2" />
          Thêm thành viên
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : !members || members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                    <Users className="w-12 h-12 opacity-20 mx-auto mb-4" />
                    <p>Chưa có thành viên nào.</p>
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow key={member.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">
                          {member.userFullName || 'Chưa cập nhật'}
                        </span>
                        <span className="text-xs text-muted-foreground">{member.userId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-3.5 h-3.5" />
                        {member.userEmail || 'Chưa cập nhật'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.role === 'owner' ? 'default' : 'secondary'} className="uppercase tracking-widest text-[10px] font-bold">
                        {member.role === 'owner' ? 'Quản trị viên' : 'Nhân viên'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.status === 'active' ? 'default' : 'outline'} className={`uppercase tracking-widest text-[10px] font-bold ${member.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-0' : ''}`}>
                        {member.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(member.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                  </TableRow>
                ))
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
    </div>
  );
}
