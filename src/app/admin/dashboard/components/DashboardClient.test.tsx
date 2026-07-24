import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DashboardClient } from './DashboardClient';
import type {
  DashboardFilters,
  DashboardInitialData,
} from '@/features/admin/types';
import * as queries from '@/features/admin/queries/dashboard.queries';

const mockPush = jest.fn();
const mockOverviewRefetch = jest.fn().mockResolvedValue({});
const mockMarginRefetch = jest.fn().mockResolvedValue({});
const mockAnalyticsRefetch = jest.fn().mockResolvedValue({});
const mockEventsRefetch = jest.fn().mockResolvedValue({});

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/admin/dashboard',
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('@/features/admin/queries/dashboard.queries');

jest.mock('./DashboardToolbar', () => ({
  DashboardToolbar: (props: {
    onRefresh: () => void;
    onApply: (from: string, to: string) => void;
  }) => (
    <div>
      <button onClick={props.onRefresh}>Làm mới test</button>
      <button onClick={() => props.onApply('2026-07-01', '2026-07-23')}>
        Áp dụng test
      </button>
    </div>
  ),
}));
jest.mock('./DashboardKpiGrid', () => ({
  DashboardKpiGrid: ({ data }: { data?: { totalUsers: number } | null }) => (
    <div>Tổng user: {data?.totalUsers}</div>
  ),
}));
jest.mock('./AIMarginPanel', () => ({
  AIMarginPanel: () => <div>AI margin panel</div>,
}));
jest.mock('./PayOSPanel', () => ({
  PayOSPanel: () => <div>PayOS panel</div>,
}));
jest.mock('./DashboardTrendChart', () => ({
  DashboardTrendChart: () => <div>Trend chart</div>,
}));
jest.mock('./AIEventsTable', () => ({
  AIEventsTable: (props: {
    onStatusChange: (status: string) => void;
    onPageChange: (page: number) => void;
  }) => (
    <div>
      <button onClick={() => props.onStatusChange('FAILED')}>
        Filter failed
      </button>
      <button onClick={() => props.onPageChange(2)}>Trang 2</button>
    </div>
  ),
}));

const filters: DashboardFilters = {
  fromDate: '2026-06-23',
  toDate: '2026-07-23',
  aiStatus: '',
  aiPage: 1,
};

const initialData: DashboardInitialData = {
  overview: {
    kpiCards: {
      totalUsers: 1500,
      activeUsersDau: 720,
      totalBrands: 45,
      pendingReviewBrands: 3,
      subscriptionRevenueVnd: 125_000_000,
      netAiMarginVnd: 87_500_000,
      payOSSuccessCount: 98,
      updatedAt: '2026-07-23T10:00:00Z',
    },
    aiMargin: null,
    payosReconcile: null,
  },
  aiMargin: null,
  analytics: null,
  aiEvents: null,
};

const queryResult = (
  data: unknown,
  refetch: jest.Mock,
) => ({
  data,
  error: null,
  isLoading: false,
  isFetching: false,
  refetch,
});

describe('DashboardClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (queries.useDashboardOverview as jest.Mock).mockReturnValue(
      queryResult(initialData.overview, mockOverviewRefetch),
    );
    (queries.useDashboardAIMargin as jest.Mock).mockReturnValue(
      queryResult(null, mockMarginRefetch),
    );
    (queries.useDashboardAnalytics as jest.Mock).mockReturnValue(
      queryResult(null, mockAnalyticsRefetch),
    );
    (queries.useDashboardAIEvents as jest.Mock).mockReturnValue(
      queryResult(null, mockEventsRefetch),
    );
  });

  it('hiển thị dữ liệu thật và refresh các query đang hoạt động', async () => {
    render(
      <DashboardClient
        filters={filters}
        initialData={initialData}
        hasCustomDateRange={false}
      />,
    );

    expect(screen.getByText('Tổng user: 1500')).toBeTruthy();
    fireEvent.click(screen.getByText('Làm mới test'));

    await waitFor(() => {
      expect(mockOverviewRefetch).toHaveBeenCalled();
      expect(mockAnalyticsRefetch).toHaveBeenCalled();
      expect(mockEventsRefetch).toHaveBeenCalled();
    });
    expect(mockMarginRefetch).not.toHaveBeenCalled();
  });

  it('ghi date filter, status và pagination vào URL', () => {
    render(
      <DashboardClient
        filters={filters}
        initialData={initialData}
        hasCustomDateRange={false}
      />,
    );

    fireEvent.click(screen.getByText('Áp dụng test'));
    expect(mockPush).toHaveBeenCalledWith(
      '/admin/dashboard?fromDate=2026-07-01&toDate=2026-07-23',
      { scroll: false },
    );

    fireEvent.click(screen.getByText('Filter failed'));
    expect(mockPush).toHaveBeenCalledWith(
      '/admin/dashboard?aiStatus=FAILED&aiPage=1',
      { scroll: false },
    );

    fireEvent.click(screen.getByText('Trang 2'));
    expect(mockPush).toHaveBeenCalledWith(
      '/admin/dashboard?aiPage=2',
      { scroll: false },
    );
  });
});
