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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  userType: z.enum(['APP_USER', 'OFFLINE_PHONE']),
  userId: z.string().optional(),
  phone: z.string().optional(),
  customerName: z.string().optional(),
  purchaseAmount: z.coerce.number().min(1000, 'Số tiền mua hàng tối thiểu 1.000đ'),
  reason: z.string().min(1, 'Vui lòng nhập lý do'),
}).superRefine((data, ctx) => {
  if (data.userType === 'APP_USER' && !data.userId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vui lòng nhập User ID',
      path: ['userId'],
    });
  }
  if (data.userType === 'OFFLINE_PHONE' && !data.phone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vui lòng nhập số điện thoại',
      path: ['phone'],
    });
  }
});

interface Props {
  brandId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultUserId?: string;
  defaultPhone?: string;
}

export default function AddPointsDialog({ brandId, open, onOpenChange, defaultUserId, defaultPhone }: Props) {
  const { mutateAsync: addPoints, isPending } = useAddLoyaltyPoints(brandId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      userType: defaultUserId ? 'APP_USER' : defaultPhone ? 'OFFLINE_PHONE' : 'APP_USER',
      userId: defaultUserId || '',
      phone: defaultPhone || '',
      customerName: '',
      purchaseAmount: 0,
      reason: 'Mua hàng tại cửa hàng',
    },
  });

  const userType = form.watch('userType');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await addPoints({
        userId: values.userType === 'APP_USER' ? values.userId : undefined,
        phone: values.userType === 'OFFLINE_PHONE' ? values.phone : undefined,
        customerName: values.customerName,
        purchaseAmount: values.purchaseAmount,
        transactionType: 'earn',
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
          <DialogTitle className="text-xl font-bold">Cộng điểm khách hàng</DialogTitle>
          <DialogDescription>
            Quy đổi từ số tiền mua hàng thành điểm loyalty dựa trên hạng hiện tại của khách.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Loại khách hàng</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!defaultUserId}>
                    <FormControl>
                      <SelectTrigger className="w-full rounded-xl h-11">
                        <SelectValue placeholder="Chọn loại khách hàng">
                          {field.value === 'APP_USER' ? 'Người dùng App (Có User ID)' : 
                           field.value === 'OFFLINE_PHONE' ? 'Khách Offline (SĐT)' : 'Chọn loại khách hàng'}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="APP_USER">Người dùng App (Có User ID)</SelectItem>
                      <SelectItem value="OFFLINE_PHONE">Khách Offline (SĐT)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {userType === 'APP_USER' ? (
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">User ID</FormLabel>
                    <FormControl>
                      <Input placeholder="usr_123456" className="rounded-xl" {...field} disabled={!!defaultUserId} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="+84901234567" className="rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Tên khách hàng (Tùy chọn)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nguyễn Văn B" className="rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="purchaseAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Số tiền mua hàng (VND)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="500000" className="rounded-xl" {...field} />
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
                    <Input placeholder="Mua hàng tại cửa hàng..." className="rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full mr-2">
                Hủy
              </Button>
              <Button type="submit" disabled={isPending} className="rounded-full">
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Cộng điểm
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
