import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type {
  BrandDashboardFilters,
  BrandDashboardInitialData,
} from '@/features/brand-portal/types';
import { DashboardClient } from './DashboardClient';

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams('sampleId=sample-1');
let mockIsStaff = true;
let mockKpiError: unknown = null;

const mockRefetchKpi = jest.fn().mockResolvedValue({});
const mockRefetchPoints = jest.fn().mockResolvedValue({});
const mockRefetchAnalytics = jest.fn().mockResolvedValue({});
const mockRefetchSamples = jest.fn().mockResolvedValue({});
const mockRefetchSampleAnalytics = jest.fn().mockResolvedValue({});
const mockRefetchFeedbacks = jest.fn().mockResolvedValue({});
const mockRefetchAcquisition = jest.fn().mockResolvedValue({});
const mockRefetchSpend = jest.fn().mockResolvedValue({});
const mockRefetchTiers = jest.fn().mockResolvedValue({});
const mockRefetchExpiry = jest.fn().mockResolvedValue({});
const mockRefetchBenefits = jest.fn().mockResolvedValue({});
const mockRefetchCatalog = jest.fn().mockResolvedValue({});

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  usePathname: () => '/brand/brand-1/dashboard',
  useSearchParams: () => mockSearchParams,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children?: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

jest.mock('@/features/brand-portal/context/BrandRoleContext', () => ({
  useBrandRole: () => ({
    isStaff: mockIsStaff,
    isLoading: false,
  }),
}));

jest.mock('@/features/brand-portal/queries/brand-dashboard.queries', () => ({
  useBrandDashboardKPICards: () => ({
    data: {
      brandId: 'brand-1',
      totalMembers: 10,
      pointsIssued: 20,
      pointsRedeemed: 5,
      activeVouchers: 2,
      vouchersRedeemed: 1,
      digitalSampleVotesCount: 4,
      digitalSampleAvgRating: 4.5,
      openCsTickets: 3,
      csFirstResponseAvgSeconds: 30,
      updatedAt: '2026-07-24T00:00:00Z',
    },
    isLoading: false,
    isFetching: false,
    error: mockKpiError,
    refetch: mockRefetchKpi,
  }),
  useBrandDashboardPointsLiability: () => ({
    data: {
      brandId: 'brand-1',
      pointsExpiring30d: 100,
      pointsLiabilityValueVnd: 500000,
    },
    isLoading: false,
    isFetching: false,
    error: null,
    refetch: mockRefetchPoints,
  }),
  useBrandDashboardAnalytics: () => ({
    data: {
      targetDashboard: 'brand',
      granularity: 'day',
      series: [],
    },
    isLoading: false,
    isFetching: false,
    error: null,
    refetch: mockRefetchAnalytics,
  }),
  useBrandDashboardSamples: () => ({
    data: [
      {
        id: 'sample-1',
        name: 'Sample One',
        itemType: 'sample',
      },
    ],
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    error: null,
    refetch: mockRefetchSamples,
  }),
  useBrandDashboardSampleAnalytics: () => ({
    data: null,
    isLoading: false,
    isFetching: false,
    error: null,
    refetch: mockRefetchSampleAnalytics,
  }),
  useBrandDashboardSampleFeedbacks: () => ({
    data: {
      items: [],
      metadata: {
        page: 1,
        limit: 20,
        totalPages: 0,
        totalItems: 0,
      },
    },
    isLoading: false,
    isFetching: false,
    error: null,
    refetch: mockRefetchFeedbacks,
  }),
  useBrandDashboardCustomerAcquisition: () => ({ data: null, isLoading: false, isFetching: false, error: null, refetch: mockRefetchAcquisition }),
  useBrandDashboardSpendSegmentation: () => ({ data: null, isLoading: false, isFetching: false, error: null, refetch: mockRefetchSpend }),
  useBrandDashboardTierDistribution: () => ({ data: null, isLoading: false, isFetching: false, error: null, refetch: mockRefetchTiers }),
  useBrandDashboardPointExpiryForecast: () => ({ data: null, isLoading: false, isFetching: false, error: null, refetch: mockRefetchExpiry }),
  useBrandDashboardBenefitRedemptionAnalytics: () => ({ data: null, isLoading: false, isFetching: false, error: null, refetch: mockRefetchBenefits }),
  useBrandDashboardCatalogStats: () => ({ data: null, isLoading: false, isFetching: false, error: null, refetch: mockRefetchCatalog }),
}));

jest.mock('./BrandDashboardInsights', () => ({
  BrandDashboardInsights: ({ onTabChange }: { onTabChange: (tab: 'loyalty') => void }) => (
    <button type="button" onClick={() => onTabChange('loyalty')}>Tab Loyalty test</button>
  ),
}));
jest.mock('./DashboardKpiGrid', () => ({
  DashboardKpiGrid: () => <div>KPI widget</div>,
}));

jest.mock('./DashboardTrendChart', () => ({
  DashboardTrendChart: () => <div>Trend widget</div>,
}));

jest.mock('./SampleAnalyticsPanel', () => ({
  SampleAnalyticsPanel: ({
    onSampleChange,
  }: {
    onSampleChange: (sampleId: string) => void;
  }) => (
    <button type="button" onClick={() => onSampleChange('sample-2')}>
      Chọn sample 2
    </button>
  ),
}));

jest.mock('./SampleFeedbackTable', () => ({
  SampleFeedbackTable: ({
    onPageChange,
  }: {
    onPageChange: (page: number) => void;
  }) => (
    <button type="button" onClick={() => onPageChange(2)}>
      Trang feedback 2
    </button>
  ),
}));

jest.mock('./DashboardToolbar', () => ({
  DashboardToolbar: ({
    onApply,
    onRefresh,
  }: {
    onApply: (fromDate: string, toDate: string) => void;
    onRefresh: () => void;
  }) => (
    <div>
      <button
        type="button"
        onClick={() => onApply('2026-07-01', '2026-07-24')}
      >
        Áp dụng ngày
      </button>
      <button type="button" onClick={onRefresh}>
        Làm mới
      </button>
    </div>
  ),
}));

const filters: BrandDashboardFilters = {
  fromDate: '2026-06-24',
  toDate: '2026-07-24',
  sampleId: 'sample-1',
  feedbackPage: 1,
  insightTab: 'customers',
};

const initialData: BrandDashboardInitialData = {
  kpiCards: null,
  pointsLiability: null,
  analytics: null,
  samples: null,
  sampleAnalytics: null,
  sampleFeedbacks: null,
};

beforeEach(() => {
  mockPush.mockClear();
  mockReplace.mockClear();
  mockKpiError = null;
  mockIsStaff = true;
  mockSearchParams = new URLSearchParams('sampleId=sample-1');
  [
    mockRefetchKpi,
    mockRefetchPoints,
    mockRefetchAnalytics,
    mockRefetchSamples,
    mockRefetchSampleAnalytics,
    mockRefetchFeedbacks,
    mockRefetchAcquisition,
    mockRefetchSpend,
    mockRefetchTiers,
    mockRefetchExpiry,
    mockRefetchBenefits,
    mockRefetchCatalog,
  ].forEach((mockRefetch) => mockRefetch.mockClear());
});

describe('DashboardClient', () => {
  it('ẩn giá trị liability tài chính với Staff', () => {
    render(
      <DashboardClient
        brandId="brand-1"
        filters={filters}
        initialData={initialData}
      />,
    );

    expect(screen.getByText('Ẩn theo quyền Staff')).toBeTruthy();
    expect(screen.queryByText('500.000 ₫')).toBeNull();
  });

  it('ghi date, sample và feedback page lên URL', () => {
    render(
      <DashboardClient
        brandId="brand-1"
        filters={filters}
        initialData={initialData}
      />,
    );

    fireEvent.click(screen.getByText('Áp dụng ngày'));
    expect(mockPush.mock.calls[0][0]).toContain('fromDate=2026-07-01');
    expect(mockPush.mock.calls[0][0]).toContain('toDate=2026-07-24');

    fireEvent.click(screen.getByText('Chọn sample 2'));
    expect(mockPush.mock.calls[1][0]).toContain('sampleId=sample-2');
    expect(mockPush.mock.calls[1][0]).toContain('feedbackPage=1');

    fireEvent.click(screen.getByText('Trang feedback 2'));
    expect(mockPush.mock.calls[2][0]).toContain('feedbackPage=2');
  });

  it('canonicalize sample đầu tiên khi URL không có sample hợp lệ', async () => {
    mockSearchParams = new URLSearchParams();
    render(
      <DashboardClient
        brandId="brand-1"
        filters={{ ...filters, sampleId: '' }}
        initialData={initialData}
      />,
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        '/brand/brand-1/dashboard?sampleId=sample-1&feedbackPage=1',
        { scroll: false },
      );
    });
  });

  it('refetch tất cả query đang bật bằng nút Làm mới', async () => {
    render(
      <DashboardClient
        brandId="brand-1"
        filters={filters}
        initialData={initialData}
      />,
    );
    fireEvent.click(screen.getByText('Làm mới'));

    await waitFor(() => {
      expect(mockRefetchKpi).toHaveBeenCalled();
      expect(mockRefetchPoints).toHaveBeenCalled();
      expect(mockRefetchAnalytics).toHaveBeenCalled();
      expect(mockRefetchSamples).toHaveBeenCalled();
      expect(mockRefetchSampleAnalytics).toHaveBeenCalled();
      expect(mockRefetchFeedbacks).toHaveBeenCalled();
      expect(mockRefetchAcquisition).toHaveBeenCalled();
      expect(mockRefetchSpend).toHaveBeenCalled();
    });
  });

  it('hiển thị màn hình 403 thay vì các widget', () => {
    mockKpiError = { response: { status: 403 } };
    render(
      <DashboardClient
        brandId="brand-1"
        filters={filters}
        initialData={initialData}
      />,
    );

    expect(
      screen.getByText('Bạn không có quyền truy cập brand này'),
    ).toBeTruthy();
    expect(screen.queryByText('KPI widget')).toBeNull();
  });
});
