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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateBenefit, useGetLoyaltyTiers } from '@/features/brand-portal/queries/brand-portal.queries';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên phúc lợi'),
  description: z.string().min(1, 'Vui lòng nhập mô tả'),
  benefitType: z.enum(['POINT_REDEMPTION', 'TIER_PRIVILEGE', 'FEATURE_ACCESS']),
  requiredPoints: z.coerce.number().optional(),
  requiredTierId: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.benefitType === 'POINT_REDEMPTION' && (!data.requiredPoints || data.requiredPoints <= 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vui lòng nhập số điểm hợp lệ',
      path: ['requiredPoints'],
    });
  }
  if (data.benefitType === 'TIER_PRIVILEGE' && !data.requiredTierId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vui lòng chọn hạng yêu cầu',
      path: ['requiredTierId'],
    });
  }
});

interface Props {
  brandId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateBenefitDialog({ brandId, open, onOpenChange }: Props) {
  const { mutateAsync: createBenefit, isPending } = useCreateBenefit(brandId);
  const { data: tiers, isLoading: isLoadingTiers } = useGetLoyaltyTiers(brandId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      benefitType: 'POINT_REDEMPTION',
      requiredPoints: 0,
      requiredTierId: '',
    },
  });

  const benefitType = form.watch('benefitType');

  // Reset conditional fields when type changes
  React.useEffect(() => {
    if (benefitType === 'POINT_REDEMPTION') {
      form.setValue('requiredTierId', '');
    } else if (benefitType === 'TIER_PRIVILEGE') {
      form.setValue('requiredPoints', 0);
    } else {
      form.setValue('requiredPoints', 0);
      form.setValue('requiredTierId', '');
    }
  }, [benefitType, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createBenefit({
        name: values.name,
        description: values.description,
        benefitType: values.benefitType,
        requiredPoints: values.benefitType === 'POINT_REDEMPTION' ? values.requiredPoints : undefined,
        requiredTierId: values.benefitType === 'TIER_PRIVILEGE' ? values.requiredTierId : undefined,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Tạo phúc lợi mới</DialogTitle>
          <DialogDescription>
            Định nghĩa phần thưởng hoặc đặc quyền cho khách hàng.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Tên phúc lợi</FormLabel>
                  <FormControl>
                    <Input placeholder="Voucher giảm giá 50k..." className="rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Mô tả</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Chi tiết về phúc lợi..." 
                      className="rounded-xl resize-none" 
                      rows={3} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="benefitType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Loại phúc lợi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full rounded-xl h-11">
                        <SelectValue placeholder="Chọn loại phúc lợi">
                          {field.value === 'POINT_REDEMPTION' ? 'Đổi điểm lấy quà' : 
                           field.value === 'TIER_PRIVILEGE' ? 'Đặc quyền theo hạng' : 
                           field.value === 'FEATURE_ACCESS' ? 'Quyền truy cập đặc biệt' : 'Chọn loại phúc lợi'}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="POINT_REDEMPTION">Đổi điểm lấy quà</SelectItem>
                      <SelectItem value="TIER_PRIVILEGE">Đặc quyền theo hạng</SelectItem>
                      <SelectItem value="FEATURE_ACCESS">Quyền truy cập đặc biệt</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {benefitType === 'POINT_REDEMPTION' && (
              <FormField
                control={form.control}
                name="requiredPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Điểm yêu cầu</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5000" className="rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {benefitType === 'TIER_PRIVILEGE' && (
              <FormField
                control={form.control}
                name="requiredTierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Hạng yêu cầu</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingTiers}>
                      <FormControl>
                        <SelectTrigger className="w-full rounded-xl h-11">
                          <SelectValue placeholder={isLoadingTiers ? "Đang tải..." : "Chọn hạng"}>
                            {field.value && tiers ? tiers.find(t => t.id === field.value)?.name : (isLoadingTiers ? "Đang tải..." : "Chọn hạng")}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiers?.map(tier => (
                          <SelectItem key={tier.id} value={tier.id}>{tier.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full mr-2">
                Hủy
              </Button>
              <Button type="submit" disabled={isPending} className="rounded-full">
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Tạo phúc lợi
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
