import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { brandDashboardApi } from '../api/brand-dashboard.api';
import { brandPortalApi } from '../api/brand-portal.api';
import type { BrandDashboardFilters, BrandKPICards } from '../types';
import {
  brandDashboardQueryKeys,
  useBrandDashboardAnalytics,
  useBrandDashboardCatalogStats,
  useBrandDashboardCustomerAcquisition,
  useBrandDashboardKPICards,
  useBrandDashboardSampleAnalytics,
  useBrandDashboardSampleFeedbacks,
  useBrandDashboardSamples,
} from './brand-dashboard.queries';

jest.mock('../api/brand-dashboard.api', () => ({
  brandDashboardApi: {
    getKPICards: jest.fn(),
    getPointsLiability: jest.fn(),
    queryAnalytics: jest.fn(),
    getSampleAnalytics: jest.fn(),
    getSampleFeedbacks: jest.fn(),
    getCustomerAcquisition: jest.fn(),
    getSpendSegmentation: jest.fn(),
    getTierDistribution: jest.fn(),
    getPointExpiryForecast: jest.fn(),
    getBenefitRedemptionAnalytics: jest.fn(),
    getCatalogStats: jest.fn(),
  },
}));

jest.mock('../api/brand-portal.api', () => ({
  brandPortalApi: {
    getBrandItems: jest.fn(),
  },
}));

const filters: BrandDashboardFilters = {
  fromDate: '2026-06-24',
  toDate: '2026-07-24',
  sampleId: 'sample-1',
  feedbackPage: 2,
  insightTab: 'customers',
};

const createHarness = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('Brand Dashboard query hooks', () => {
  it('đưa brandId vào mọi query key và phân tách filter', () => {
    expect(brandDashboardQueryKeys.kpiCards('brand-a')).toEqual([
      'brand-dashboard',
      'brand-a',
      'kpi-cards',
    ]);
    expect(brandDashboardQueryKeys.analytics('brand-a', filters)).toEqual([
      'brand-dashboard',
      'brand-a',
      'analytics',
      '2026-06-24',
      '2026-07-24',
    ]);
    expect(
      brandDashboardQueryKeys.sampleFeedbacks('brand-a', 'sample-1', 2),
    ).toEqual([
      'brand-dashboard',
      'brand-a',
      'sample-feedbacks',
      'sample-1',
      2,
    ]);
    expect(brandDashboardQueryKeys.kpiCards('brand-b')).not.toEqual(
      brandDashboardQueryKeys.kpiCards('brand-a'),
    );
  });

  it('dùng initialData, staleTime và focus refresh riêng cho dashboard', () => {
    const initialData: BrandKPICards = {
      brandId: 'brand-a',
      totalMembers: 1,
      pointsIssued: 2,
      pointsRedeemed: 3,
      activeVouchers: 4,
      vouchersRedeemed: 5,
      digitalSampleVotesCount: 6,
      digitalSampleAvgRating: 4.5,
      openCsTickets: 7,
      csFirstResponseAvgSeconds: 8,
      updatedAt: '2026-07-24T00:00:00Z',
    };
    const { queryClient, wrapper } = createHarness();
    const { result } = renderHook(
      () => useBrandDashboardKPICards('brand-a', initialData),
      { wrapper },
    );

    expect(result.current.data).toEqual(initialData);
    const query = queryClient
      .getQueryCache()
      .find({ queryKey: brandDashboardQueryKeys.kpiCards('brand-a') });
    const options = query?.options as unknown as {
      staleTime?: number;
      refetchOnWindowFocus?: string;
    };
    expect(options.staleTime).toBe(60_000);
    expect(options.refetchOnWindowFocus).toBe('always');
  });

  it('chỉ giữ dữ liệu trước đó cho biểu đồ theo thời gian', () => {
    const { queryClient, wrapper } = createHarness();

    renderHook(() => useBrandDashboardAnalytics('brand-a', filters), {
      wrapper,
    });
    renderHook(() => useBrandDashboardSampleAnalytics('brand-a', 'sample-1'), {
      wrapper,
    });
    renderHook(() => useBrandDashboardSampleFeedbacks('brand-a', filters), {
      wrapper,
    });

    const analytics = queryClient
      .getQueryCache()
      .find({ queryKey: brandDashboardQueryKeys.analytics('brand-a', filters) });
    const sample = queryClient.getQueryCache().find({
      queryKey: brandDashboardQueryKeys.sampleAnalytics(
        'brand-a',
        'sample-1',
      ),
    });
    const feedback = queryClient.getQueryCache().find({
      queryKey: brandDashboardQueryKeys.sampleFeedbacks(
        'brand-a',
        'sample-1',
        2,
      ),
    });

    const getPlaceholderData = (query: typeof analytics) =>
      (
        query?.options as unknown as {
          placeholderData?: unknown;
        }
      ).placeholderData;
    expect(typeof getPlaceholderData(analytics)).toBe('function');
    expect(getPlaceholderData(sample)).toBeUndefined();
    expect(getPlaceholderData(feedback)).toBeUndefined();
  });

  it('không dùng initialData của sample cũ cho sample đang chọn', () => {
    jest
      .mocked(brandDashboardApi.getSampleAnalytics)
      .mockReturnValue(new Promise(() => {}));
    const { wrapper } = createHarness();
    const { result } = renderHook(
      () =>
        useBrandDashboardSampleAnalytics('brand-a', 'sample-new', {
          itemId: 'sample-old',
          votesCount: 10,
          avgRating: 3.4,
          feedbackSentiment: '',
          topPairedCategories: [],
        }),
      { wrapper },
    );

    expect(result.current.data).toBeUndefined();
  });
  it('bỏ qua analytics khi response không thuộc sample đang chọn', async () => {
    jest.mocked(brandDashboardApi.getSampleAnalytics).mockResolvedValue({
      itemId: 'sample-old',
      votesCount: 10,
      avgRating: 3.4,
      feedbackSentiment: '',
      topPairedCategories: [],
    });
    const { queryClient, wrapper } = createHarness();

    renderHook(
      () => useBrandDashboardSampleAnalytics('brand-a', 'sample-new'),
      { wrapper },
    );

    await queryClient.refetchQueries({
      queryKey: brandDashboardQueryKeys.sampleAnalytics(
        'brand-a',
        'sample-new',
      ),
    });

    expect(
      queryClient.getQueryData(
        brandDashboardQueryKeys.sampleAnalytics('brand-a', 'sample-new'),
      ),
    ).toBeNull();
  });

  it('không gọi query item-specific khi chưa có sampleId', () => {
    const { wrapper } = createHarness();
    renderHook(() => useBrandDashboardSampleAnalytics('brand-a', ''), {
      wrapper,
    });
    renderHook(
      () =>
        useBrandDashboardSampleFeedbacks('brand-a', {
          ...filters,
          sampleId: '',
        }),
      { wrapper },
    );

    expect(brandDashboardApi.getSampleAnalytics).not.toHaveBeenCalled();
    expect(brandDashboardApi.getSampleFeedbacks).not.toHaveBeenCalled();
  });

  it('lọc itemType sample không phân biệt hoa thường', async () => {
    jest.mocked(brandPortalApi.getBrandItems).mockResolvedValue([
      {
        id: 'sample-1',
        brandId: 'brand-a',
        name: 'Sample',
        price: 0,
        itemType: 'SAMPLE',
        status: 'active',
      },
      {
        id: 'product-1',
        brandId: 'brand-a',
        name: 'Product',
        price: 0,
        itemType: 'product',
        status: 'active',
      },
    ]);
    const { queryClient, wrapper } = createHarness();
    renderHook(() => useBrandDashboardSamples('brand-a'), { wrapper });

    await queryClient.refetchQueries({
      queryKey: brandDashboardQueryKeys.samples('brand-a'),
    });
    expect(
      queryClient.getQueryData(brandDashboardQueryKeys.samples('brand-a')),
    ).toEqual([
      {
        id: 'sample-1',
        name: 'Sample',
        imageUrl: undefined,
        itemType: 'SAMPLE',
      },
    ]);
  });
  it('không gọi query của nhóm insight chưa được bật', () => {
    const { wrapper } = createHarness();
    renderHook(
      () => useBrandDashboardCustomerAcquisition('brand-a', { enabled: false }),
      { wrapper },
    );
    renderHook(
      () => useBrandDashboardCatalogStats('brand-a', { enabled: false }),
      { wrapper },
    );

    expect(brandDashboardApi.getCustomerAcquisition).not.toHaveBeenCalled();
    expect(brandDashboardApi.getCatalogStats).not.toHaveBeenCalled();
  });
});
