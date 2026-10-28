"use client";
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAddBrandMembers } from '@/features/brand-portal/queries/brand-portal.queries';
import { Loader2 } from 'lucide-react';

interface Props {
  brandId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddMemberDialog({ brandId, open, onOpenChange }: Props) {
  const [inputValues, setInputValues] = useState('');
  const { mutateAsync: addMember, isPending } = useAddBrandMembers(brandId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValues.trim()) return;

    const emails = Array.from(new Set(
      inputValues.split(/[,\n]+/).map(i => i.trim()).filter(Boolean)
    ));

    if (emails.length === 0) return;

    const payload = emails.map(email => ({
      emailOrUsername: email,
      role: 'staff'
    }));

    try {
      await addMember(payload);
      setInputValues('');
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
            Nhập email hoặc username của người dùng (có thể nhập nhiều người, cách nhau bằng dấu phẩy hoặc xuống dòng).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="emails" className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Emails / Usernames</Label>
            <Textarea
              id="emails"
              value={inputValues}
              onChange={(e) => setInputValues(e.target.value)}
              placeholder="user1@example.com, user2@example.com..."
              className="col-span-3 rounded-xl bg-muted/50 min-h-24 resize-none"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full px-6">
              Hủy
            </Button>
            <Button type="submit" disabled={isPending || !inputValues.trim()} className="rounded-full px-6">
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Thêm thành viên
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
