import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';
import { campaignAdminApi } from '../api/campaign-admin.api';
import {
  CreateCampaignReq,
  UpdateCampaignReq,
  CloseCampaignReq,
  GetCampaignsParams,
  GetCampaignClaimsParams,
  GetCampaignAuditParams,
} from '../types/campaign-admin.types';

export const ADMIN_CAMPAIGN_KEYS = {
  all: ['admin-campaigns'] as const,
  list: (params?: GetCampaignsParams) => [...ADMIN_CAMPAIGN_KEYS.all, 'list', params] as const,
  detail: (code: string) => [...ADMIN_CAMPAIGN_KEYS.all, 'detail', code] as const,
  claims: (code: string, params?: GetCampaignClaimsParams) =>
    [...ADMIN_CAMPAIGN_KEYS.all, 'claims', code, params] as const,
  eligibility: (code: string, userId: string) =>
    [...ADMIN_CAMPAIGN_KEYS.all, 'eligibility', code, userId] as const,
  audit: (code: string, params?: GetCampaignAuditParams) =>
    [...ADMIN_CAMPAIGN_KEYS.all, 'audit', code, params] as const,
};

// 1. Hook danh sách chiến dịch
export const useAdminCampaigns = (params?: GetCampaignsParams) => {
  return useQuery({
    queryKey: ADMIN_CAMPAIGN_KEYS.list(params),
    queryFn: () => campaignAdminApi.getCampaigns(params),
    staleTime: 30 * 1000, // 30s vì số liệu ngân sách biến động liên tục
  });
};

// 2. Hook chi tiết một chiến dịch
export const useAdminCampaignDetail = (code?: string) => {
  return useQuery({
    queryKey: ADMIN_CAMPAIGN_KEYS.detail(code || ''),
    queryFn: () => campaignAdminApi.getCampaignDetail(code!),
    enabled: !!code,
    staleTime: 10 * 1000,
  });
};

// 3. Hook danh sách lượt cấp
export const useAdminCampaignClaims = (code?: string, params?: GetCampaignClaimsParams) => {
  return useQuery({
    queryKey: ADMIN_CAMPAIGN_KEYS.claims(code || '', params),
    queryFn: () => campaignAdminApi.getCampaignClaims(code!, params),
    enabled: !!code,
  });
};

// 4. Hook tra cứu điều kiện tài khoản
export const useAdminAccountEligibility = (code?: string, userId?: string, enabled = false) => {
  return useQuery({
    queryKey: ADMIN_CAMPAIGN_KEYS.eligibility(code || '', userId || ''),
    queryFn: () => campaignAdminApi.getAccountEligibility(code!, userId!),
    enabled: enabled && !!code && !!userId,
    retry: false, // Không retry khi lỗi 404
  });
};

// 5. Hook nhật ký kiểm toán
export const useAdminCampaignAudit = (code?: string, params?: GetCampaignAuditParams) => {
  return useQuery({
    queryKey: ADMIN_CAMPAIGN_KEYS.audit(code || '', params),
    queryFn: () => campaignAdminApi.getCampaignAudit(code!, params),
    enabled: !!code,
  });
};

// 6. Mutation tạo chiến dịch mới
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCampaignReq) => campaignAdminApi.createCampaign(data),
    onSuccess: async (data) => {
      toast.success(`Khởi tạo chiến dịch ${data.code} thành công!`);
      // Invalidate toàn bộ danh sách
      await queryClient.invalidateQueries({ queryKey: ADMIN_CAMPAIGN_KEYS.all });
      // Bắt buộc refetch chi tiết chiến dịch mới tạo để tải số liệu thực
      await queryClient.refetchQueries({ queryKey: ADMIN_CAMPAIGN_KEYS.detail(data.code) });
    },
    onError: (error: unknown) => {
      let msg = 'Không thể tạo chiến dịch. Vui lòng kiểm tra lại thông tin.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      toast.error(msg);
    },
  });
};

// 7. Mutation sửa chiến dịch
export const useUpdateCampaign = (code: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCampaignReq) => campaignAdminApi.updateCampaign(code, data),
    onSuccess: async () => {
      toast.success('Cập nhật chiến dịch thành công!');
      await queryClient.invalidateQueries({ queryKey: ADMIN_CAMPAIGN_KEYS.all });
      await queryClient.refetchQueries({ queryKey: ADMIN_CAMPAIGN_KEYS.detail(code) });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.status === 412) {
        toast.warning(
          'Dữ liệu chiến dịch đã bị thay đổi bởi thao tác khác. Hệ thống đang tải lại thông tin mới nhất...'
        );
        queryClient.invalidateQueries({ queryKey: ADMIN_CAMPAIGN_KEYS.detail(code) });
      } else {
        let msg = 'Không thể cập nhật chiến dịch. Vui lòng thử lại sau.';
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          msg = error.response.data.message;
        }
        toast.error(msg);
      }
    },
  });
};

// 8. Mutation đóng cưỡng bức chiến dịch
export const useCloseCampaign = (code: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CloseCampaignReq) => campaignAdminApi.closeCampaign(code, data),
    onSuccess: async () => {
      toast.success('Đã đóng chiến dịch thành công!');
      await queryClient.invalidateQueries({ queryKey: ADMIN_CAMPAIGN_KEYS.all });
      await queryClient.refetchQueries({ queryKey: ADMIN_CAMPAIGN_KEYS.detail(code) });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.status === 412) {
        toast.warning(
          'Dữ liệu chiến dịch đã bị thay đổi bởi thao tác khác. Hệ thống đang tải lại thông tin mới nhất...'
        );
        queryClient.invalidateQueries({ queryKey: ADMIN_CAMPAIGN_KEYS.detail(code) });
      } else {
        let msg = 'Không thể đóng chiến dịch. Vui lòng thử lại sau.';
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          msg = error.response.data.message;
        }
        toast.error(msg);
      }
    },
  });
};
