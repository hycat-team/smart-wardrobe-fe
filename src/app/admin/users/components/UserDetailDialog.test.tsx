import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { UserDetailDialog } from './UserDetailDialog';
import {
  useAdminSubscriptionPlans,
  useAdminUserDetail,
  useAdminUserSubscription,
  useCancelUserSubscription,
  useGrantSubscription,
} from '@/features/admin/queries/admin.queries';

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

jest.mock('@/features/admin/queries/admin.queries', () => ({
  useAdminUserDetail: jest.fn(),
  useAdminUserSubscription: jest.fn(),
  useAdminSubscriptionPlans: jest.fn(),
  useGrantSubscription: jest.fn(),
  useCancelUserSubscription: jest.fn(),
}));

const mockedDetail = useAdminUserDetail as jest.Mock;
const mockedRaw = useAdminUserSubscription as jest.Mock;
const mockedPlans = useAdminSubscriptionPlans as jest.Mock;
const mockedGrant = useGrantSubscription as jest.Mock;
const mockedCancel = useCancelUserSubscription as jest.Mock;

const userId = '5b0c9f54-7d61-4f7a-9a4e-9f1f7f4f3a21';

const user = {
  id: userId,
  username: 'duck.nguyen',
  email: 'duck.nguyen@example.com',
  firstName: 'Duck',
  roleSlug: 'user',
  status: 0,
  createdAt: '2026-01-01T00:00:00Z',
  subscription: {},
};

beforeEach(() => {
  jest.clearAllMocks();
  mockedDetail.mockReturnValue({
    data: {
      ...user,
      subscription: {
        planName: 'Free',
        planSlug: 'free',
        isAutoRenewEnabled: false,
        personalizationEnabled: false,
        maxWardrobeItems: 30,
        maxOutfits: 10,
        aiOutfitDailyQuota: 3,
        aiChatDailyQuota: 1,
      },
    },
    isLoading: false,
    isError: false,
  });
  mockedRaw.mockReturnValue({
    data: {
      userId,
      planId: 'plan-1',
      planName: 'Premium Monthly',
      planSlug: 'premium-monthly',
      startedAt: '2020-01-01T00:00:00Z',
      expiresAt: '2020-02-01T00:00:00Z',
      isAutoRenewEnabled: false,
    },
    isLoading: false,
  });
  mockedPlans.mockReturnValue({
    data: [
      {
        id: 'plan-1',
        slug: 'premium-monthly',
        name: 'Premium Monthly',
        price: 99000,
        maxWardrobeItems: 300,
        maxOutfits: 300,
        aiOutfitDailyQuota: 30,
        aiChatDailyQuota: 10,
        durationDays: 30,
        isActive: true,
      },
    ],
    isLoading: false,
  });
});

describe('UserDetailDialog subscription actions', () => {
  it('grants the selected plan with an idempotency key', async () => {
    const mutateAsync = jest.fn().mockResolvedValue({
      total: 1,
      succeeded: 1,
      skipped: 0,
      failed: 0,
      results: [{ index: 0, userIdentifier: userId, planSlug: 'premium-monthly', status: 'success' }],
    });
    mockedGrant.mockReturnValue({ mutateAsync, isPending: false });
    mockedCancel.mockReturnValue({ mutateAsync: jest.fn(), isPending: false });

    render(<UserDetailDialog userId={userId} initialMode="grant" onClose={jest.fn()} />);

    fireEvent.click(await screen.findByRole('button', { name: 'Cấp gói' }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    expect(mutateAsync).toHaveBeenCalledWith({
      items: [{ userIdentifier: userId, planSlug: 'premium-monthly' }],
      idempotencyKey: expect.any(String),
    });
  });

  it('requires the confirm step before cancelling a subscription', async () => {
    const mutateAsync = jest.fn().mockResolvedValue(undefined);
    mockedGrant.mockReturnValue({ mutateAsync: jest.fn(), isPending: false });
    mockedCancel.mockReturnValue({ mutateAsync, isPending: false });

    render(<UserDetailDialog userId={userId} initialMode="cancel" onClose={jest.fn()} />);

    expect(mutateAsync).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận huỷ' }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledWith(userId));
  });

  it('shows both the effective plan and the raw subscription record', () => {
    mockedGrant.mockReturnValue({ mutateAsync: jest.fn(), isPending: false });
    mockedCancel.mockReturnValue({ mutateAsync: jest.fn(), isPending: false });

    render(<UserDetailDialog userId={userId} initialMode="view" onClose={jest.fn()} />);

    expect(screen.getByText('Free')).toBeTruthy();
    expect(screen.getByText('Premium Monthly')).toBeTruthy();
    expect(screen.getByText('Đã hết hạn')).toBeTruthy();
    expect(screen.getByText('Hạn mức AI outfit / ngày')).toBeTruthy();
    expect(screen.getByText(/không phải số lượt còn lại hôm nay/)).toBeTruthy();
  });

  it('offers the active plans as labelled radio cards, not raw slugs', () => {
    mockedGrant.mockReturnValue({ mutateAsync: jest.fn(), isPending: false });
    mockedCancel.mockReturnValue({ mutateAsync: jest.fn(), isPending: false });

    render(<UserDetailDialog userId={userId} initialMode="grant" onClose={jest.fn()} />);

    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios).toHaveLength(1);
    expect(radios[0].checked).toBe(true);
    expect(screen.getAllByText('Premium Monthly').length).toBeGreaterThan(0);
    expect(screen.getByText(/30 ngày/)).toBeTruthy();
    expect(screen.queryByText('premium-monthly')).toBeNull();
  });
});
