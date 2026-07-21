import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAddLoyaltyPoints } from '@/features/brand-portal/queries/brand-portal.queries';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  pointsToDeduct: z.coerce.number().min(1, 'Số điểm trừ tối thiểu là 1'),
  reason: z.string().min(1, 'Vui lòng nhập lý do'),
});

interface Props {
  brandId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultUserId?: string;
  defaultPhone?: string;
  currentPoints: number;
}

export default function DeductPointsDialog({ brandId, open, onOpenChange, defaultUserId, defaultPhone, currentPoints }: Props) {
  const { mutateAsync: addPoints, isPending } = useAddLoyaltyPoints(brandId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      pointsToDeduct: 0,
      reason: 'Đổi phần thưởng / Đổi quà tại cửa hàng',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.pointsToDeduct > currentPoints) {
      form.setError('pointsToDeduct', {
        type: 'manual',
        message: `Số điểm trừ không được vượt quá số điểm khả dụng (${currentPoints} điểm)`,
      });
      return;
    }

    try {
      await addPoints({
        userId: defaultUserId ? defaultUserId : undefined,
        phone: !defaultUserId && defaultPhone ? defaultPhone : undefined,
        pointsDelta: -Math.abs(values.pointsToDeduct),
        transactionType: 'redeem',
        reason: values.reason,
        idempotencyKey: crypto.randomUUID(),
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      // Handled by axios toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Đổi quà / Trừ điểm</DialogTitle>
          <DialogDescription>
            Sử dụng điểm tích lũy của khách hàng để đổi thưởng. Khách hàng đang có <span className="font-bold text-emerald-600">{currentPoints.toLocaleString()}</span> điểm khả dụng.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="pointsToDeduct"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Số điểm cần trừ</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ví dụ: 100" className="rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Lý do</FormLabel>
                  <FormControl>
                    <Input placeholder="Đổi quà..." className="rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full mr-2">
                Hủy
              </Button>
              <Button type="submit" disabled={isPending} className="rounded-full bg-amber-600 hover:bg-amber-700 text-white">
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Xác nhận trừ điểm
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
