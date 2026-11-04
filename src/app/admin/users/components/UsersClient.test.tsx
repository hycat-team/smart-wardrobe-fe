import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { UsersClient } from './UsersClient';
import {
  useAdminUsers,
  useAdminUserSubscription,
  useAdminSubscriptionPlans,
  useAdminUserDetail,
  useCancelUserSubscription,
  useGrantSubscription,
  useUpdateUserStatus,
} from '@/features/admin/queries/admin.queries';

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

jest.mock('@/features/admin/queries/admin.queries', () => ({
  useAdminUsers: jest.fn(),
  useUpdateUserStatus: jest.fn(),
  useAdminUserDetail: jest.fn(),
  useAdminUserSubscription: jest.fn(),
  useAdminSubscriptionPlans: jest.fn(),
  useGrantSubscription: jest.fn(),
  useCancelUserSubscription: jest.fn(),
}));

const mockedUseAdminUsers = useAdminUsers as jest.Mock;
const mockedUseAdminUserDetail = useAdminUserDetail as jest.Mock;
const mockedUseAdminUserSubscription = useAdminUserSubscription as jest.Mock;
const mockedUseSubscriptionPlans = useAdminSubscriptionPlans as jest.Mock;
const mockedUseUpdateUserStatus = useUpdateUserStatus as jest.Mock;
const mockedUseGrantSubscription = useGrantSubscription as jest.Mock;
const mockedUseCancelSubscription = useCancelUserSubscription as jest.Mock;

function buildUser(overrides: Record<string, unknown> = {}) {
  return {
    id: '5b0c9f54-7d61-4f7a-9a4e-9f1f7f4f3a21',
    username: 'duck.nguyen',
    email: 'duck.nguyen@example.com',
    firstName: 'Duck',
    lastName: 'Nguyen',
    roleSlug: 'user',
    status: 0,
    createdAt: '2026-01-01T00:00:00Z',
    subscription: {
      planId: 'plan-1',
      planName: 'Premium Monthly',
      planSlug: 'premium-monthly',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    ...overrides,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseUpdateUserStatus.mockReturnValue({ mutate: jest.fn(), isPending: false });
  mockedUseAdminUserDetail.mockReturnValue({ data: undefined, isLoading: false, isError: false });
  mockedUseAdminUserSubscription.mockReturnValue({ data: null, isLoading: false });
  mockedUseSubscriptionPlans.mockReturnValue({ data: [], isLoading: false });
  mockedUseGrantSubscription.mockReturnValue({ mutateAsync: jest.fn(), isPending: false });
  mockedUseCancelSubscription.mockReturnValue({ mutateAsync: jest.fn(), isPending: false });
  mockedUseAdminUsers.mockReturnValue({
    data: {
      items: [buildUser()],
      metadata: { page: 1, limit: 10, totalItems: 1, totalPages: 1 },
    },
    isLoading: false,
    isError: false,
  });
});

describe('UsersClient filters', () => {
  it('defaults to the user role filter and requests page 1', () => {
    render(<UsersClient />);

    expect(mockedUseAdminUsers).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1, limit: 10, roleSlug: 'user' }),
    );
  });

  it('shows Vietnamese labels in the filter triggers instead of raw values', () => {
    render(<UsersClient />);

    expect(screen.getByText('Người dùng')).toBeTruthy();
    expect(screen.getByText('Tất cả trạng thái')).toBeTruthy();
    expect(screen.queryByText('user')).toBeNull();
    expect(screen.queryByText('all')).toBeNull();
  });

  it('switches to the exact userId filter when a UUID is typed', async () => {
    render(<UsersClient />);
    const uuid = '5b0c9f54-7d61-4f7a-9a4e-9f1f7f4f3a21';

    fireEvent.change(screen.getByPlaceholderText(/TÌM TÊN, EMAIL/), {
      target: { value: uuid },
    });

    await waitFor(
      () =>
        expect(mockedUseAdminUsers).toHaveBeenLastCalledWith(
          expect.objectContaining({ userId: uuid }),
        ),
      { timeout: 1500 },
    );
    expect(screen.getByText('Đang lọc theo mã người dùng')).toBeTruthy();
  });

  it('keeps the free-text query for non-UUID input', async () => {
    render(<UsersClient />);

    fireEvent.change(screen.getByPlaceholderText(/TÌM TÊN, EMAIL/), {
      target: { value: 'duck' },
    });

    await waitFor(
      () =>
        expect(mockedUseAdminUsers).toHaveBeenLastCalledWith(
          expect.objectContaining({ q: 'duck' }),
        ),
      { timeout: 1500 },
    );
  });
});

describe('UsersClient plan column', () => {
  it('shows the effective plan with its expiry', () => {
    render(<UsersClient />);

    expect(screen.getByText('Premium Monthly')).toBeTruthy();
    expect(screen.getByText(/Đang áp dụng/)).toBeTruthy();
  });

  it('shows the empty plan state when the account has none', () => {
    mockedUseAdminUsers.mockReturnValue({
      data: {
        items: [buildUser({ subscription: {} })],
        metadata: { page: 1, limit: 10, totalItems: 1, totalPages: 1 },
      },
      isLoading: false,
      isError: false,
    });

    render(<UsersClient />);

    expect(screen.getByText('Chưa cấp gói')).toBeTruthy();
  });

  it('labels an admin account instead of hiding it', () => {
    mockedUseAdminUsers.mockReturnValue({
      data: {
        items: [buildUser({ roleSlug: 'admin' })],
        metadata: { page: 1, limit: 10, totalItems: 1, totalPages: 1 },
      },
      isLoading: false,
      isError: false,
    });

    render(<UsersClient />);

    expect(screen.getByText('ADMIN')).toBeTruthy();
  });
});
