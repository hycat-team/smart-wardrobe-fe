export type CampaignStatus =
  | 'not_started'    // Chưa tới startsAt
  | 'running'        // Đang mở, còn suất chính
  | 'compensation'   // Hết suất chính, đã chốt watermark, còn suất dự phòng
  | 'exhausted'      // Đã chạm trần cứng quota + reserve
  | 'expired'        // Đã qua endsAt
  | 'closed';        // Quản trị viên đóng cưỡng bức (ưu tiên cao nhất)

export interface CampaignSummaryRes {
  code: string;                     // Mã định danh chiến dịch
  planSlug: string;                 // Mã gói cước (ví dụ: premium-monthly)
  planName: string;                 // Tên hiển thị của gói (ví dụ: Premium Tháng)
  quota: number;                    // Hạn mức chính (>= 1)
  reserve: number;                  // Suất dự phòng (>= 0)
  grantedMainCount: number;         // Số suất chính đã cấp thực tế
  grantedCompensationCount: number; // Số suất dự phòng đã cấp thực tế
  grantedTotalCount: number;        // Tổng số đã cấp (main + compensation)
  remainingMain: number;            // Suất chính còn lại
  remainingCompensation: number;    // Suất dự phòng còn lại
  hardCap: number;                  // Trần cứng tối đa (quota + reserve)
  startsAt: string;                 // Thời điểm bắt đầu (RFC3339 có múi giờ)
  endsAt: string | null;            // Thời điểm kết thúc (RFC3339 có múi giờ hoặc null)
  watermarkAt: string | null;       // Thời điểm chốt mốc ưu tiên
  status: CampaignStatus;           // Trạng thái vòng đời chiến dịch
  degraded: boolean;                // Cờ cảnh báo lỗi worker cấp gói nền
  degradedReason?: string;          // Lý do kỹ thuật khi worker bị suy giảm/lỗi
  lastSweepAt: string | null;       // Lần quét bù thành công gần nhất
  closedAt: string | null;          // Thời điểm quản trị viên đóng cưỡng bức
  budgetLocked: boolean;            // true khi đã cấp ít nhất 1 suất (grantedTotalCount > 0)
  version: number;                  // Phiên bản dữ liệu phục vụ kiểm soát đồng thời
}

export type ClaimSource = 'main' | 'reserve';

export interface CampaignClaimItem {
  userId: string;                   // UUID tài khoản người dùng
  username: string;                 // Tên đăng nhập người dùng
  planSlug: string;                 // Mã gói cước được cấp
  expiresAt: string;                // Thời điểm gói hết hạn (RFC3339)
  grantedAt: string;                // Thời điểm hệ thống cấp gói (RFC3339)
  registeredAt: string;             // Thời điểm người dùng đăng ký (RFC3339)
  source: ClaimSource;              // Nguồn ngân sách: "main" hoặc "reserve"
}

export type EligibilityStatus =
  | 'granted'                         // Đã được cấp trong chiến dịch này
  | 'eligible_pending'                // Đủ điều kiện, đang chờ xử lý (< 1 phút)
  | 'eligible_but_exhausted'          // Đủ điều kiện nhưng hết suất / sau watermark
  | 'not_eligible'                    // Không thỏa mãn điều kiện
  | 'already_claimed_other_campaign'  // Đã nhận gói ở chiến dịch trước
  | 'created_by_admin';               // Do quản trị viên tạo

export type EligibilityReasonCode =
  | ''                                // Rỗng (hợp lệ ở granted và eligible_pending)
  | 'campaign_not_configured'
  | 'campaign_not_started'
  | 'campaign_sleeping'
  | 'created_by_admin'
  | 'already_claimed'
  | 'already_on_plan'
  | 'plan_not_settled'
  | 'outside_window'
  | 'quota_main'
  | 'quota_compensation'
  | 'quota_anomaly'
  | 'plan_unavailable';

export interface EligibilityRes {
  campaignCode: string;               // Mã chiến dịch tra cứu
  userId: string;                     // Mã người dùng tra cứu
  eligibility: EligibilityStatus;     // 1 trong 6 trạng thái điều kiện
  granted: boolean;                   // true nếu đã được cấp
  watermarkAt: string | null;         // Mốc ưu tiên
  userRegisteredAt: string;           // Thời điểm người dùng đăng ký
  reason?: EligibilityReasonCode;     // Mã lý do giải thích
}

export type CampaignAuditAction =
  | 'campaign.create'
  | 'campaign.update'
  | 'campaign.close';

export interface CampaignAuditCreatePayload {
  campaignCode: string;
  planSlug: string;
  quota: number;
  reserve: number;
  startsAt: string;
  endsAt: string | null;
}

export interface CampaignAuditUpdatePayload {
  campaignCode: string;
  before: {
    version: number;
    quota?: number;
    reserve?: number;
    planSlug?: string;
    startsAt?: string;
    endsAt?: string;
  };
  after: {
    version: number;
    quota?: number;
    reserve?: number;
    planSlug?: string;
    startsAt?: string;
    endsAt?: string;
  };
}

export interface CampaignAuditClosePayload {
  campaignCode: string;
  reason: string;
  before: {
    closedAt: string;
    version: number;
  };
  after: {
    closedAt: string;
    version: number;
  };
}

export type CampaignAuditPayload =
  | CampaignAuditCreatePayload
  | CampaignAuditUpdatePayload
  | CampaignAuditClosePayload;

export interface CampaignAuditItem {
  id: string;                         // UUID bản ghi nhật ký
  actorUserId: string;               // UUID quản trị viên thao tác
  action: CampaignAuditAction;       // 1 trong 3 hành động
  targetType: 'campaign';             // Luôn là "campaign"
  targetId: null;                    // ⚠️ Luôn là null
  payload: CampaignAuditPayload;     // Nội dung thay đổi
  requestIp?: string;                 // Địa chỉ IP
  createdAt: string;                 // Thời điểm ghi nhận (RFC3339)
}

// Request DTOs
export interface CreateCampaignReq {
  code: string;
  planSlug: string;
  quota: number;
  reserve?: number;
  startsAt: string;
  endsAt?: string | null;
}

export interface UpdateCampaignReq {
  version: number;
  planSlug?: string;
  quota?: number;
  reserve?: number;
  startsAt?: string;
  endsAt?: string | null;
}

export interface CloseCampaignReq {
  version: number;
  reason: string;
}

export interface GetCampaignsParams {
  page?: number;
  limit?: number;
}

export interface GetCampaignClaimsParams {
  page?: number;
  limit?: number;
  from?: string; // RFC3339 with timezone
  to?: string;   // RFC3339 with timezone
}

export interface GetCampaignAuditParams {
  page?: number;
  limit?: number;
}
