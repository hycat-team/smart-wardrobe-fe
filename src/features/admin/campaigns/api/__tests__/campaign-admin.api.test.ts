import MockAdapter from 'axios-mock-adapter';
import api from '@/lib/axios';
import { campaignAdminApi } from '../campaign-admin.api';

describe('campaignAdminApi', () => {
  const mock = new MockAdapter(api);

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('gọi GET /admin/campaigns và trả về danh sách chiến dịch', async () => {
    const mockData = {
      items: [
        {
          code: 'launch-2026-10',
          planSlug: 'premium-monthly',
          planName: 'Premium Tháng',
          quota: 50,
          reserve: 5,
          grantedMainCount: 23,
          grantedCompensationCount: 0,
          grantedTotalCount: 23,
          remainingMain: 27,
          remainingCompensation: 5,
          hardCap: 55,
          startsAt: '2026-10-02T00:00:00+07:00',
          endsAt: null,
          watermarkAt: null,
          status: 'running',
          degraded: false,
          degradedReason: '',
          lastSweepAt: '2026-10-02T20:31:12+07:00',
          closedAt: null,
          budgetLocked: true,
          version: 1,
        },
      ],
      metadata: { page: 1, limit: 20, totalItems: 1, totalPages: 1 },
    };

    mock.onGet('/admin/campaigns').reply(200, {
      success: true,
      message: 'Thành công',
      data: mockData,
    });

    const res = await campaignAdminApi.getCampaigns({ page: 1, limit: 20 });
    expect(res.items).toHaveLength(1);
    expect(res.items[0].code).toBe('launch-2026-10');
    expect(res.items[0].hardCap).toBe(55);
  });

  it('gọi GET /admin/campaigns/:code và trả về chi tiết chiến dịch', async () => {
    const mockDetail = {
      code: 'launch-2026-10',
      planSlug: 'premium-monthly',
      planName: 'Premium Tháng',
      quota: 50,
      reserve: 5,
      grantedMainCount: 50,
      grantedCompensationCount: 5,
      grantedTotalCount: 55,
      remainingMain: 0,
      remainingCompensation: 0,
      hardCap: 55,
      startsAt: '2026-10-02T00:00:00+07:00',
      endsAt: null,
      watermarkAt: '2026-10-02T00:04:17+07:00',
      status: 'exhausted',
      degraded: false,
      degradedReason: '',
      lastSweepAt: '2026-10-02T20:31:12+07:00',
      closedAt: null,
      budgetLocked: true,
      version: 1,
    };

    mock.onGet('/admin/campaigns/launch-2026-10').reply(200, {
      success: true,
      message: 'Thành công',
      data: mockDetail,
    });

    const res = await campaignAdminApi.getCampaignDetail('launch-2026-10');
    expect(res.code).toBe('launch-2026-10');
    expect(res.status).toBe('exhausted');
    expect(res.budgetLocked).toBe(true);
  });

  it('gọi POST /admin/campaigns để mở chiến dịch mới', async () => {
    const payload = {
      code: 'tet-2027',
      planSlug: 'premium-monthly',
      quota: 100,
      reserve: 10,
      startsAt: '2027-01-20T00:00:00+07:00',
      endsAt: '2027-02-05T00:00:00+07:00',
    };

    const mockCreated = {
      ...payload,
      planName: '',
      grantedMainCount: 0,
      grantedCompensationCount: 0,
      grantedTotalCount: 0,
      remainingMain: 100,
      remainingCompensation: 10,
      hardCap: 110,
      watermarkAt: null,
      status: 'not_started',
      degraded: false,
      degradedReason: '',
      lastSweepAt: null,
      closedAt: null,
      budgetLocked: false,
      version: 1,
    };

    mock.onPost('/admin/campaigns').reply(201, {
      success: true,
      message: 'Khởi tạo thành công',
      data: mockCreated,
    });

    const res = await campaignAdminApi.createCampaign(payload);
    expect(res.code).toBe('tet-2027');
    expect(res.version).toBe(1);
  });

  it('gọi PATCH /admin/campaigns/:code để sửa chiến dịch', async () => {
    const updatePayload = {
      version: 1,
      quota: 120,
    };

    mock.onPatch('/admin/campaigns/tet-2027').reply(200, {
      success: true,
      message: 'Cập nhật thành công',
      data: { code: 'tet-2027', quota: 120, version: 2 },
    });

    const res = await campaignAdminApi.updateCampaign('tet-2027', updatePayload);
    expect(res.version).toBe(2);
  });

  it('gọi POST /admin/campaigns/:code/close để đóng chiến dịch', async () => {
    const closePayload = {
      version: 2,
      reason: 'Hết ngân sách thử nghiệm',
    };

    mock.onPost('/admin/campaigns/tet-2027/close').reply(200, {
      success: true,
      message: 'Đóng thành công',
      data: {
        code: 'tet-2027',
        status: 'closed',
        closedAt: '2026-10-05T12:00:00+07:00',
        version: 3,
      },
    });

    const res = await campaignAdminApi.closeCampaign('tet-2027', closePayload);
    expect(res.status).toBe('closed');
    expect(res.closedAt).toBeDefined();
  });

  it('gọi GET /admin/campaigns/:code/eligibility/:userId để tra cứu điều kiện', async () => {
    const mockEligibility = {
      campaignCode: 'launch-2026-10',
      userId: 'user-uuid-1234',
      eligibility: 'eligible_pending',
      granted: false,
      watermarkAt: null,
      userRegisteredAt: '2026-10-02T00:31:40+07:00',
    };

    mock
      .onGet('/admin/campaigns/launch-2026-10/eligibility/user-uuid-1234')
      .reply(200, {
        success: true,
        message: 'Thành công',
        data: mockEligibility,
      });

    const res = await campaignAdminApi.getAccountEligibility(
      'launch-2026-10',
      'user-uuid-1234'
    );
    expect(res.eligibility).toBe('eligible_pending');
    expect(res.granted).toBe(false);
  });
});
