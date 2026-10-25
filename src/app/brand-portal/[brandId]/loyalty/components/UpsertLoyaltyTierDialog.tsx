import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LoyaltyTierRes } from '@/features/brand-portal/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useCreateLoyaltyTier, useUpdateLoyaltyTier } from '@/features/brand-portal/queries/brand-portal.queries';

const formSchema = z.object({
  name: z.string().min(2, 'Tên hạng thành viên phải có ít nhất 2 ký tự').max(50, 'Tên hạng thành viên tối đa 50 ký tự'),
  rank: z.coerce.number().min(1, 'Thứ tự hạng phải lớn hơn 0'),
  minTotalSpend: z.coerce.number().min(0, 'Mức chi tiêu tối thiểu không được âm'),
  description: z.string().max(255, 'Mô tả tối đa 255 ký tự').optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UpsertLoyaltyTierDialogProps {
  brandId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier?: LoyaltyTierRes; // If provided, it's an edit action
}

export default function UpsertLoyaltyTierDialog({
  brandId,
  open,
  onOpenChange,
  tier,
}: UpsertLoyaltyTierDialogProps) {
  const isEditing = !!tier;
  
  const createTierMutation = useCreateLoyaltyTier(brandId);
  const updateTierMutation = useUpdateLoyaltyTier(brandId);

  const isPending = createTierMutation.isPending || updateTierMutation.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: '',
      rank: 1,
      minTotalSpend: 0,
      description: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (tier) {
        form.reset({
          name: tier.name,
          rank: tier.rank,
          minTotalSpend: tier.minTotalSpend,
          description: tier.description || '',
        });
      } else {
        form.reset({
          name: '',
          rank: 1,
          minTotalSpend: 0,
          description: '',
        });
      }
    }
  }, [open, tier, form]);

  const onSubmit = (values: any) => {
    if (isEditing && tier) {
      updateTierMutation.mutate(
        { tierId: tier.id, payload: values },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } else {
      createTierMutation.mutate(values, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-border bg-card">
        <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-muted/30">
          <DialogTitle className="text-xl">
            {isEditing ? 'Cập nhật hạng thành viên' : 'Thêm hạng thành viên mới'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Thay đổi thông tin chi tiết về hạng thành viên của thương hiệu.' 
              : 'Thiết lập hạng thành viên mới với mức chi tiêu yêu cầu.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)}>
            <div className="p-6 space-y-6">
              <FormField
                control={form.control as any}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest font-bold">Tên hạng <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Gold, Silver, VVIP..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="rank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest font-bold">Thứ tự hạng <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription className="text-[11px]">
                        Số càng nhỏ, hạng càng thấp. Phải là duy nhất.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="minTotalSpend"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest font-bold">Chi tiêu tối thiểu (VNĐ) <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="1000" {...field} />
                      </FormControl>
                      <FormDescription className="text-[11px]">
                        Tổng tiền khách hàng cần chi.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control as any}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest font-bold">Mô tả đặc quyền</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Mô tả ngắn gọn về những ưu đãi khách hàng nhận được khi đạt hạng này..." 
                        className="resize-none min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="p-6 pt-4 border-t border-border/50 bg-muted/30">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="w-full sm:w-auto rounded-xl font-bold text-xs uppercase tracking-widest"
              >
                Hủy bỏ
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full sm:w-auto rounded-xl font-bold text-xs uppercase tracking-widest"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Lưu thay đổi' : 'Tạo hạng thành viên'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
