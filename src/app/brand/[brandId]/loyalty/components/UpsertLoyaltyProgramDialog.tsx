import React, { useEffect } from 'react';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUpsertLoyaltyProgram } from '@/features/brand-portal/queries/brand-portal.queries';
import { LoyaltyProgram } from '@/features/brand-portal/types';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên chương trình'),
  amountPerPoint: z.coerce.number().min(1, 'Số tiền trên mỗi điểm phải lớn hơn 0'),
  pointExpiryDays: z.coerce.number().min(0, 'Số ngày hết hạn không hợp lệ').optional().or(z.literal(0)),
  roundingMode: z.enum(['floor', 'round', 'ceil']),
  isActive: z.boolean(),
});

interface Props {
  brandId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program?: LoyaltyProgram;
}

export default function UpsertLoyaltyProgramDialog({ brandId, open, onOpenChange, program }: Props) {
  const { mutateAsync: upsertProgram, isPending } = useUpsertLoyaltyProgram(brandId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      amountPerPoint: 10000,
      pointExpiryDays: 365,
      roundingMode: 'floor',
      isActive: true,
    },
  });

  useEffect(() => {
    if (program && open) {
      form.reset({
        name: program.name,
        amountPerPoint: program.amountPerPoint,
        pointExpiryDays: program.pointExpiryDays || 0,
        roundingMode: program.roundingMode,
        isActive: program.isActive,
      });
    } else if (open && !program) {
      form.reset({
        name: 'Chương trình thẻ thành viên',
        amountPerPoint: 10000,
        pointExpiryDays: 365,
        roundingMode: 'floor',
        isActive: true,
      });
    }
  }, [program, open, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await upsertProgram({
        name: values.name,
        amountPerPoint: values.amountPerPoint,
        pointExpiryDays: values.pointExpiryDays || undefined,
        roundingMode: values.roundingMode,
        isActive: values.isActive,
      });
      onOpenChange(false);
    } catch (error) {
      // Handled globally
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {program ? 'Chỉnh sửa chương trình Loyalty' : 'Thiết lập chương trình Loyalty'}
          </DialogTitle>
          <DialogDescription>
            Cấu hình tỷ lệ quy đổi điểm và quy tắc hết hạn cho khách hàng.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên chương trình</FormLabel>
                  <FormControl>
                    <Input placeholder="Vd: Thẻ thành viên VIP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amountPerPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tiền / 1 điểm (VNĐ)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10000" {...field} />
                    </FormControl>
                    <FormDescription>10.000đ = 1 điểm</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pointExpiryDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hạn sử dụng (Ngày)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Để trống nếu không giới hạn" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormDescription>Bỏ trống = vĩnh viễn</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="roundingMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chế độ làm tròn điểm</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full rounded-xl h-11">
                        <SelectValue placeholder="Chọn kiểu làm tròn">
                          {field.value === 'floor' ? 'Làm tròn xuống (VD: 1.9 → 1)' : 
                           field.value === 'round' ? 'Làm tròn gần nhất (VD: 1.5 → 2)' : 
                           field.value === 'ceil' ? 'Làm tròn lên (VD: 1.1 → 2)' : 'Chọn kiểu làm tròn'}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-[100] rounded-xl border-border bg-popover shadow-md">
                      <SelectItem value="floor">Làm tròn xuống (VD: 1.9 → 1)</SelectItem>
                      <SelectItem value="round">Làm tròn gần nhất (VD: 1.5 → 2)</SelectItem>
                      <SelectItem value="ceil">Làm tròn lên (VD: 1.1 → 2)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border/50 p-4 shadow-sm bg-muted/20">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-medium">Hoạt động</FormLabel>
                    <FormDescription>
                      Kích hoạt chương trình ngay sau khi thiết lập.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
                Hủy
              </Button>
              <Button type="submit" disabled={isPending} className="rounded-xl">
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Lưu cấu hình
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
