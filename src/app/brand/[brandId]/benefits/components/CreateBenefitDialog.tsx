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
  benefitType: z.enum(['voucher', 'discount', 'gift', 'free_shipping', 'early_access', 'feature_access']),
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
  if (data.benefitType === 'feature_access' && !data.featureCode) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vui lòng chọn mã tính năng đặc quyền',
      path: ['featureCode'],
    });
  }
});

interface Props {
  brandId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BENEFIT_TYPE_LABELS = {
  voucher: 'Voucher giảm giá',
  discount: 'Giảm giá trực tiếp',
  gift: 'Quà tặng hiện vật',
  free_shipping: 'Miễn phí vận chuyển',
  early_access: 'Mua sớm BST mới',
  feature_access: 'Quyền truy cập đặc biệt'
};

const UNLOCK_TYPE_LABELS = {
  point_redemption: 'Đổi điểm lấy quà',
  tier_privilege: 'Đặc quyền theo hạng',
  manual_grant: 'Cấp phát thủ công'
};

const FEATURE_CODE_LABELS = {
  sample_mix_access: 'Thử đồ mẫu (Digital Sample Lab)',
  brand_item_recommendation: 'Gợi ý phối đồ AI ưu tiên',
  priority_brand_chat: 'Kênh chat hỗ trợ ưu tiên'
};

export default function CreateBenefitDialog({ brandId, open, onOpenChange }: Props) {
  const { mutateAsync: createBenefit, isPending } = useCreateBenefit(brandId);
  const { data: tiers, isLoading: isLoadingTiers } = useGetLoyaltyTiers(brandId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      benefitType: 'gift',
      unlockType: 'point_redemption',
      requiredPoints: 0,
      requiredTierId: '',
      featureCode: '',
      validDurationDays: 0,
    },
  });

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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full rounded-xl h-11">
                        <SelectValue placeholder="Chọn loại phúc lợi">
                          {field.value ? BENEFIT_TYPE_LABELS[field.value as keyof typeof BENEFIT_TYPE_LABELS] : undefined}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="voucher" className="rounded-lg cursor-pointer py-2.5">Voucher giảm giá</SelectItem>
                      <SelectItem value="discount" className="rounded-lg cursor-pointer py-2.5">Giảm giá trực tiếp</SelectItem>
                      <SelectItem value="gift" className="rounded-lg cursor-pointer py-2.5">Quà tặng hiện vật</SelectItem>
                      <SelectItem value="free_shipping" className="rounded-lg cursor-pointer py-2.5">Miễn phí vận chuyển</SelectItem>
                      <SelectItem value="early_access" className="rounded-lg cursor-pointer py-2.5">Mua sớm BST mới</SelectItem>
                      <SelectItem value="feature_access" className="rounded-lg cursor-pointer py-2.5">Quyền truy cập đặc biệt</SelectItem>
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
                          <SelectItem value="brand_item_recommendation" className="rounded-lg cursor-pointer py-2.5">Gợi ý phối đồ AI ưu tiên</SelectItem>
                          <SelectItem value="priority_brand_chat" className="rounded-lg cursor-pointer py-2.5">Kênh chat hỗ trợ ưu tiên</SelectItem>
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
                      <SelectItem value="point_redemption" className="rounded-lg cursor-pointer py-2.5">Đổi điểm lấy quà</SelectItem>
                      <SelectItem value="tier_privilege" className="rounded-lg cursor-pointer py-2.5">Đặc quyền theo hạng</SelectItem>
                      <SelectItem value="manual_grant" className="rounded-lg cursor-pointer py-2.5">Cấp phát thủ công</SelectItem>
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
                Tạo phúc lợi
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
