"use client";
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddBrandMembers } from '@/features/brand-portal/queries/brand-portal.queries';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  brandId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddMemberDialog({ brandId, open, onOpenChange }: Props) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [role, setRole] = useState('staff');
  const { mutateAsync: addMember, isPending } = useAddBrandMembers(brandId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim()) return;

    try {
      await addMember([{ emailOrUsername, role }]);
      setEmailOrUsername('');
      setRole('staff');
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm thành viên</DialogTitle>
          <DialogDescription>
            Nhập email hoặc username của người dùng để cấp quyền truy cập vào thương hiệu này.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Email / Username</Label>
            <Input
              id="email"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="user@example.com"
              className="col-span-3 rounded-xl bg-muted/50"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role" className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Vai trò</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full rounded-xl h-11 bg-muted/50">
                <SelectValue placeholder="Chọn vai trò">
                  {role === 'staff' ? 'Nhân viên (Staff)' : role === 'owner' ? 'Quản trị viên (Owner)' : 'Chọn vai trò'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Nhân viên (Staff)</SelectItem>
                <SelectItem value="owner">Quản trị viên (Owner)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full px-6">
              Hủy
            </Button>
            <Button type="submit" disabled={isPending || !emailOrUsername.trim()} className="rounded-full px-6">
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Thêm thành viên
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
