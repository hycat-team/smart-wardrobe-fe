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
import { useCreateOfflinePurchase } from '@/features/brand-portal/queries/brand-portal.queries';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  customerName: z.string().min(1, 'Vui lòng nhập tên khách hàng'),
  phoneE164: z.string().regex(/^\+?[0-9]{10,15}$/, 'Số điện thoại không hợp lệ'),
  externalCustomerCode: z.string().optional(),
});

interface Props {
  brandId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateOfflineCustomerDialog({ brandId, open, onOpenChange }: Props) {
  const { mutateAsync: createOfflineCustomer, isPending } = useCreateOfflinePurchase(brandId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: '',
      phoneE164: '',
      externalCustomerCode: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createOfflineCustomer(values);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      // Error handled in axios interceptor
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Thêm khách hàng offline</DialogTitle>
          <DialogDescription>
            Ghi nhận khách hàng mua tại cửa hàng vật lý chưa có tài khoản.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Tên khách hàng</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" className="rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phoneE164"
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
              name="externalCustomerCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Mã khách hàng ERP (Tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder="ERP-12345" className="rounded-xl" {...field} />
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
                Xác nhận
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
