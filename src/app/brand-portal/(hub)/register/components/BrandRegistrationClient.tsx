"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateBrand } from '@/features/brand-portal/queries/brand-portal.queries';
import { Store, ArrowLeft, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  isReservedBrandSlug,
  isValidBrandSlug,
  normalizeBrandSlug,
} from '@/features/brand-portal/utils/brand-slug';

const formSchema = z.object({
  name: z.string().min(2, 'Tên thương hiệu phải có ít nhất 2 ký tự').max(100, 'Tên thương hiệu không vượt quá 100 ký tự'),
  slug: z
    .string()
    .min(2, 'Slug phải có ít nhất 2 ký tự')
    .max(100, 'Slug không vượt quá 100 ký tự')
    .refine(isValidBrandSlug, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang')
    .refine((value) => !isReservedBrandSlug(value), 'Slug này là đường dẫn hệ thống, vui lòng chọn slug khác'),
  description: z.string().max(500, 'Mô tả không vượt quá 500 ký tự').optional(),
});

function resolveAppUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
}

export default function BrandRegistrationClient() {
  const router = useRouter();
  const { mutateAsync: createBrand, isPending } = useCreateBrand();
  const [appUrl, setAppUrl] = useState('');

  useEffect(() => {
    setAppUrl(resolveAppUrl());
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  const nameValue = form.watch('name');
  const slugValue = form.watch('slug');
  const slugPreview = useMemo(
    () => `${appUrl || '…'}/brands/${slugValue || 'slug-cua-ban'}`,
    [appUrl, slugValue],
  );

  useEffect(() => {
    if (nameValue && !form.getFieldState('slug').isDirty) {
      form.setValue('slug', normalizeBrandSlug(nameValue), { shouldValidate: true });
    }
  }, [nameValue, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createBrand({
        name: values.name,
        slug: values.slug,
        description: values.description,
      });
      router.push('/brand-portal');
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      const status = err?.response?.status;
      const message = err?.response?.data?.message;
      if (status === 409) {
        form.setError('slug', {
          type: 'manual',
          message: message || 'Slug này đã được sử dụng, vui lòng chọn slug khác.',
        });
        return;
      }
      toast.error(message || 'Không thể gửi yêu cầu đăng ký. Vui lòng thử lại sau.');
    }
  };

  return (
    <Card className="rounded-3xl border-border bg-card shadow-lg overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border p-8">
        <Button variant="ghost" size="icon" className="rounded-full mb-6" onClick={() => router.push('/brand-portal')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Đăng ký thương hiệu</CardTitle>
            <CardDescription className="text-base mt-1">
              Gửi yêu cầu khởi tạo không gian quản lý cho thương hiệu mới của bạn.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="p-8 space-y-6">
            <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 p-4 rounded-xl flex items-start gap-3 text-sm mb-2">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p>Sau khi gửi yêu cầu, quản trị viên (Admin) sẽ xét duyệt thương hiệu của bạn. Khi được duyệt, bạn mới có thể truy cập vào Dashboard quản lý.</p>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Tên thương hiệu <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Mori Studio" className="rounded-xl h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Đường dẫn (Slug) <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <div className="flex items-center rounded-xl border border-input bg-transparent pr-3 focus-within:ring-1 focus-within:ring-ring overflow-hidden">
                      <span className="pl-4 text-muted-foreground text-sm bg-muted/50 h-12 flex items-center shrink-0">{appUrl || '…'}/brands/</span>
                      <Input 
                        placeholder="mori-studio" 
                        className="border-0 focus-visible:ring-0 shadow-none h-12 rounded-none px-2" 
                        {...field} 
                        onChange={(event) => field.onChange(normalizeBrandSlug(event.target.value))}
                      />
                    </div>
                  </FormControl>
                  <CardDescription className="text-xs">
                    Đường dẫn công khai của thương hiệu: <span className="font-semibold text-foreground">{slugPreview}</span>. Slug không thể thay đổi sau khi được tạo.
                  </CardDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Mô tả ngắn gọn (Tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Thương hiệu thời trang tối giản..." 
                      className="rounded-xl resize-none p-4" 
                      rows={4} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="p-8 pt-0 border-t border-border mt-6 flex justify-end gap-3 bg-muted/10">
            <Button type="button" variant="ghost" className="rounded-full mt-6" onClick={() => router.push('/brand-portal')}>
              Hủy bỏ
            </Button>
            <Button type="submit" disabled={isPending} className="rounded-full mt-6 h-11 px-8">
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Gửi yêu cầu đăng ký
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
