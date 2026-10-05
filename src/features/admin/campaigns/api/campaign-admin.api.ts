import api from '@/lib/axios';
import { APIResponse, PaginationResult } from '@/types/api';
import {
  CampaignSummaryRes,
  CampaignClaimItem,
  EligibilityRes,
  CampaignAuditItem,
  CreateCampaignReq,
  UpdateCampaignReq,
  CloseCampaignReq,
  GetCampaignsParams,
  GetCampaignClaimsParams,
  GetCampaignAuditParams,
} from '../types/campaign-admin.types';

export const campaignAdminApi = {
  // 1. Lấy danh sách chiến dịch
  getCampaigns: async (params?: GetCampaignsParams): Promise<PaginationResult<CampaignSummaryRes>> => {
    const res = await api.get<APIResponse<PaginationResult<CampaignSummaryRes>>>('/admin/campaigns', {
      params,
    });
    return res.data.data as PaginationResult<CampaignSummaryRes>;
  },

  // 2. Lấy chi tiết một chiến dịch
  getCampaignDetail: async (code: string): Promise<CampaignSummaryRes> => {
    const res = await api.get<APIResponse<CampaignSummaryRes>>(`/admin/campaigns/${encodeURIComponent(code)}`);
    return res.data.data as CampaignSummaryRes;
  },

  // 3. Lấy danh sách lượt cấp của một chiến dịch
  getCampaignClaims: async (
    code: string,
    params?: GetCampaignClaimsParams
  ): Promise<PaginationResult<CampaignClaimItem>> => {
    const res = await api.get<APIResponse<PaginationResult<CampaignClaimItem>>>(
      `/admin/campaigns/${encodeURIComponent(code)}/claims`,
      { params }
    );
    return res.data.data as PaginationResult<CampaignClaimItem>;
  },

  // 4. Tra cứu điều kiện một tài khoản
  getAccountEligibility: async (code: string, userId: string): Promise<EligibilityRes> => {
    const res = await api.get<APIResponse<EligibilityRes>>(
      `/admin/campaigns/${encodeURIComponent(code)}/eligibility/${encodeURIComponent(userId)}`
    );
    return res.data.data as EligibilityRes;
  },

  // 5. Mở chiến dịch mới
  createCampaign: async (data: CreateCampaignReq): Promise<CampaignSummaryRes> => {
    const res = await api.post<APIResponse<CampaignSummaryRes>>('/admin/campaigns', data);
    return res.data.data as CampaignSummaryRes;
  },

  // 6. Chỉnh sửa chiến dịch
  updateCampaign: async (code: string, data: UpdateCampaignReq): Promise<CampaignSummaryRes> => {
    const res = await api.patch<APIResponse<CampaignSummaryRes>>(
      `/admin/campaigns/${encodeURIComponent(code)}`,
      data
    );
    return res.data.data as CampaignSummaryRes;
  },

  // 7. Đóng cưỡng bức chiến dịch
  closeCampaign: async (code: string, data: CloseCampaignReq): Promise<CampaignSummaryRes> => {
    const res = await api.post<APIResponse<CampaignSummaryRes>>(
      `/admin/campaigns/${encodeURIComponent(code)}/close`,
      data
    );
    return res.data.data as CampaignSummaryRes;
  },

  // 8. Lấy nhật ký kiểm toán chiến dịch
  getCampaignAudit: async (
    code: string,
    params?: GetCampaignAuditParams
  ): Promise<PaginationResult<CampaignAuditItem>> => {
    const res = await api.get<APIResponse<PaginationResult<CampaignAuditItem>>>(
      `/admin/campaigns/${encodeURIComponent(code)}/audit`,
      { params }
    );
    return res.data.data as PaginationResult<CampaignAuditItem>;
  },
};
