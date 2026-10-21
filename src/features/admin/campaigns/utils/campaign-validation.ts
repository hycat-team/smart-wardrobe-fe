import { z } from 'zod';

export const createCampaignSchema = z
  .object({
    code: z
      .string()
      .min(3, { message: 'Mã chiến dịch phải có ít nhất 3 ký tự' })
      .max(64, { message: 'Mã chiến dịch tối đa 64 ký tự' })
      .regex(
        /^[a-z0-9][a-z0-9-]{2,63}$/,
        'Mã phải bắt đầu bằng chữ thường hoặc số, chỉ gồm chữ thường (a-z), số (0-9) và dấu gạch ngang (-)'
      ),
    planSlug: z.string().min(1, { message: 'Vui lòng chọn hoặc nhập mã gói cước (planSlug)' }),
    quota: z.number().int().min(1, { message: 'Hạn mức chính (quota) phải lớn hơn hoặc bằng 1' }),
    reserve: z.number().int().min(0, { message: 'Suất dự phòng (reserve) phải lớn hơn hoặc bằng 0' }),
    startsAt: z.string().min(1, { message: 'Vui lòng chọn thời gian bắt đầu' }),
    endsAt: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (!data.endsAt || data.endsAt.trim() === '') return true;
      const start = new Date(data.startsAt).getTime();
      const end = new Date(data.endsAt).getTime();
      return end > start;
    },
    {
      message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
      path: ['endsAt'],
    }
  );

export type CreateCampaignFormData = z.infer<typeof createCampaignSchema>;

export const editCampaignSchema = z
  .object({
    quota: z.number().int().min(1, { message: 'Hạn mức chính phải lớn hơn hoặc bằng 1' }).optional(),
    reserve: z.number().int().min(0, { message: 'Suất dự phòng phải lớn hơn hoặc bằng 0' }).optional(),
    planSlug: z.string().optional(),
    startsAt: z.string().min(1, { message: 'Vui lòng chọn thời gian bắt đầu' }).optional(),
    endsAt: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (!data.endsAt || data.endsAt.trim() === '' || !data.startsAt) return true;
      const start = new Date(data.startsAt).getTime();
      const end = new Date(data.endsAt).getTime();
      return end > start;
    },
    {
      message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
      path: ['endsAt'],
    }
  );

export type EditCampaignFormData = z.infer<typeof editCampaignSchema>;
