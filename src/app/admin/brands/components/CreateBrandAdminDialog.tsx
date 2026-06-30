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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useCreateBrandAdmin } from '@/features/brand-portal/queries/brand-portal.queries';

const formSchema = z.object({
  name: z.string().min(2, 'Tên thương hiệu phải có ít nhất 2 ký tự').max(100, 'Tên quá dài'),
  slug: z.string()
    .min(2, 'Slug phải có ít nhất 2 ký tự')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ chứa chữ cái thường, số và dấu gạch ngang'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Hàm hỗ trợ tạo slug từ tên
const generateSlug = (text: string) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

export default function CreateBrandAdminDialog({ open, onOpenChange }: Props) {
  const { mutateAsync: createBrand, isPending } = useCreateBrandAdmin();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  // Tự động tạo slug khi người dùng nhập tên (chỉ khi slug chưa bị sửa tay quá nhiều)
  const watchName = form.watch('name');
  const watchSlug = form.watch('slug');

  useEffect(() => {
    if (watchName) {
      const generated = generateSlug(watchName);
      // Chỉ auto-update slug nếu người dùng chưa can thiệp quá xa hoặc slug rỗng
      if (!form.getFieldState('slug').isDirty || watchSlug === generateSlug(watchName.slice(0, -1))) {
        form.setValue('slug', generated, { shouldValidate: true });
      }
    }
  }, [watchName, form, watchSlug]);

  // Reset form khi đóng/mở
  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await createBrand({
        name: values.name,
        slug: values.slug,
        description: values.description,
      });
      onOpenChange(false);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-6 border-border shadow-sm">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
            Tạo Thương hiệu mới
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1.5">
            Thương hiệu sẽ được tạo ở trạng thái ACTIVE và sẵn sàng sử dụng ngay lập tức.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                    Tên thương hiệu <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nhập tên thương hiệu..." 
                      className="rounded-xl h-11 focus-visible:ring-1" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                    Đường dẫn (Slug) <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="flex items-center justify-center h-11 px-3 text-sm text-muted-foreground bg-muted border border-r-0 border-input rounded-l-xl">
                        closy.com/brand/
                      </span>
                      <Input 
                        placeholder="ten-thuong-hieu" 
                        className="rounded-l-none rounded-r-xl h-11 focus-visible:ring-1" 
                        {...field} 
                        onChange={(e) => {
                          // Cho phép nhập tay và biến isDirty thành true
                          field.onChange(e.target.value.toLowerCase());
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                    Mô tả (Tuỳ chọn)
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Mô tả ngắn gọn về thương hiệu này..." 
                      className="resize-none min-h-[100px] rounded-xl focus-visible:ring-1" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onOpenChange(false)} 
                className="rounded-xl font-medium"
              >
                Hủy bỏ
              </Button>
              <Button 
                type="submit" 
                disabled={isPending} 
                className="rounded-xl font-medium px-6"
              >
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Tạo thương hiệu
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
