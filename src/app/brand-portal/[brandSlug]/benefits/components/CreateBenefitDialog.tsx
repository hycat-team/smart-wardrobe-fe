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
  name: z.string().min(1, 'Vui lòng nhập tên quyền lợi/voucher'),
  description: z.string().min(1, 'Vui lòng nhập mô tả'),
  benefitType: z.enum(['voucher', 'feature_access']),
  unlockType: z.enum(['point_redemption', 'tier_privilege', 'manual_grant']),
  requiredPoints: z.coerce.number().optional(),
  requiredTierId: z.string().optional(),
  featureCode: z.string().optional(),
  validDurationDays: z.coerce.number().optional(),
}).superRefine((data, ctx) => {
  if (data.unlockType === 'point_redemption' && (!data.requiredPoints || data.requiredPoints <= 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vui lòng nhập số điểm hợp lệ',
      path: ['requiredPoints'],
    });
  }
  if (data.unlockType === 'tier_privilege' && !data.requiredTierId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vui lòng chọn hạng yêu cầu',
      path: ['requiredTierId'],
    });
  }
  if (data.benefitType === 'feature_access' && data.unlockType === 'point_redemption') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Quyền lợi không hỗ trợ mở khóa bằng điểm',
      path: ['unlockType'],
    });
  }
  if (data.benefitType === 'feature_access' && !data.featureCode) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vui lòng chọn mã tính năng quyền lợi',
      path: ['featureCode'],
    });
  }
});

interface Props {
  brandId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTierId?: string;
  defaultUnlockType?: string;
}

const BENEFIT_TYPE_LABELS = {
  voucher: 'Voucher',
  feature_access: 'Quyền lợi'
};

const UNLOCK_TYPE_LABELS = {
  point_redemption: 'Đổi bằng điểm',
  tier_privilege: 'Theo hạng thành viên',
  manual_grant: 'Tặng thủ công'
};

const FEATURE_CODE_LABELS = {
  sample_mix_access: 'Thử đồ mẫu (Digital Sample Lab)',
};

export default function CreateBenefitDialog({ brandId, open, onOpenChange, defaultTierId, defaultUnlockType }: Props) {
  const { mutateAsync: createBenefit, isPending } = useCreateBenefit(brandId);
  const { data: tiers, isLoading: isLoadingTiers } = useGetLoyaltyTiers(brandId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      benefitType: 'voucher',
      unlockType: 'point_redemption',
      requiredPoints: 0,
      requiredTierId: '',
      featureCode: '',
      validDurationDays: 0,
    },
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset({
      name: '',
      description: '',
      benefitType: 'voucher',
      unlockType: (defaultUnlockType as 'point_redemption' | 'tier_privilege' | 'manual_grant')
        || (defaultTierId ? 'tier_privilege' : 'point_redemption'),
      requiredPoints: 0,
      requiredTierId: defaultTierId || '',
      featureCode: '',
      validDurationDays: 0,
    });
  }, [open, defaultTierId, defaultUnlockType, form]);
  const unlockType = form.watch('unlockType');
  const benefitType = form.watch('benefitType');

  // Reset conditional fields when unlockType changes
  React.useEffect(() => {
    if (unlockType === 'point_redemption') {
      form.setValue('requiredTierId', '');
    } else if (unlockType === 'tier_privilege') {
      form.setValue('requiredPoints', 0);
    } else {
      form.setValue('requiredPoints', 0);
      form.setValue('requiredTierId', '');
    }
  }, [unlockType, form]);

  React.useEffect(() => {
    if (benefitType !== 'feature_access') {
      form.setValue('featureCode', '');
      form.setValue('validDurationDays', 0);
    } else if (form.getValues('unlockType') === 'point_redemption') {
      form.setValue('unlockType', 'tier_privilege');
    }
  }, [benefitType, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createBenefit({
        name: values.name,
        description: values.description,
        benefitType: values.benefitType,
        unlockType: values.unlockType,
        requiredPoints: values.unlockType === 'point_redemption' ? values.requiredPoints : undefined,
        requiredTierId: values.unlockType === 'tier_privilege' ? values.requiredTierId : undefined,
        featureCode: values.benefitType === 'feature_access' ? values.featureCode : undefined,
        featureConfig: values.benefitType === 'feature_access' && values.validDurationDays ? { validDurationDays: values.validDurationDays } : undefined,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Tạo quyền lợi / voucher</DialogTitle>
          <DialogDescription>
            Tạo voucher đổi bằng điểm hoặc quyền lợi tự động theo hạng thành viên.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Tên quyền lợi/voucher</FormLabel>
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
                      placeholder="Chi tiết về quyền lợi/voucher..." 
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
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Loại</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full rounded-xl h-11">
                        <SelectValue placeholder="Chọn loại">
                          {field.value ? BENEFIT_TYPE_LABELS[field.value as keyof typeof BENEFIT_TYPE_LABELS] : undefined}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="voucher" className="rounded-lg cursor-pointer py-2.5">Voucher</SelectItem>
                      <SelectItem value="feature_access" className="rounded-lg cursor-pointer py-2.5">Quyền lợi</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {benefitType === 'feature_access' && (
              <>
                <FormField
                  control={form.control}
                  name="featureCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Mã tính năng</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full rounded-xl h-11">
                            <SelectValue placeholder="Chọn tính năng">
                              {field.value ? FEATURE_CODE_LABELS[field.value as keyof typeof FEATURE_CODE_LABELS] : undefined}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="sample_mix_access" className="rounded-lg cursor-pointer py-2.5">Thử đồ mẫu (Digital Sample Lab)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="validDurationDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Thời hạn hiệu lực (Ngày)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="30" className="rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="unlockType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Hình thức nhận</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full rounded-xl h-11">
                        <SelectValue placeholder="Chọn hình thức nhận">
                          {field.value ? UNLOCK_TYPE_LABELS[field.value as keyof typeof UNLOCK_TYPE_LABELS] : undefined}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      {benefitType === 'feature_access' ? (
                        <>
                          <SelectItem value="tier_privilege" className="rounded-lg cursor-pointer py-2.5">Theo hạng thành viên</SelectItem>
                          <SelectItem value="manual_grant" className="rounded-lg cursor-pointer py-2.5">Tặng thủ công</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="point_redemption" className="rounded-lg cursor-pointer py-2.5">Đổi bằng điểm</SelectItem>
                          <SelectItem value="tier_privilege" className="rounded-lg cursor-pointer py-2.5">Theo hạng thành viên</SelectItem>
                          <SelectItem value="manual_grant" className="rounded-lg cursor-pointer py-2.5">Tặng thủ công</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {unlockType === 'point_redemption' && (
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

            {unlockType === 'tier_privilege' && (
              <FormField
                control={form.control}
                name="requiredTierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Hạng yêu cầu</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingTiers}>
                      <FormControl>
                        <SelectTrigger className="w-full rounded-xl h-11">
                          <SelectValue placeholder={isLoadingTiers ? "Đang tải..." : "Chọn hạng"}>
                            {field.value && tiers ? tiers.find(t => t.id === field.value)?.name : undefined}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        {tiers?.map(tier => (
                          <SelectItem key={tier.id} value={tier.id} className="rounded-lg cursor-pointer py-2.5">{tier.name}</SelectItem>
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
                Tạo quyền lợi / voucher
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
