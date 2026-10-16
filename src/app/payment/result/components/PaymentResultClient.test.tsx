import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentResultClient } from './PaymentResultClient';

const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => mockSearchParams,
}));

const mockInvalidateQueries = jest.fn().mockResolvedValue(undefined);
const mockRefetchQueries = jest.fn().mockResolvedValue(undefined);

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
    refetchQueries: mockRefetchQueries,
  }),
}));

describe('PaymentResultClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it('renders success state for topup and triggers query refetch', async () => {
    mockSearchParams = new URLSearchParams({
      code: '00',
      cancel: 'false',
      orderCode: '123456',
      flow: 'topup',
      next: '/profile?tab=wallet',
    });

    render(<PaymentResultClient />);

    expect(screen.getByText('Thanh toán thành công!')).toBeTruthy();
    expect(screen.getByText('Số tiền nạp đã được ghi nhận vào ví của bạn.')).toBeTruthy();
    expect(screen.getByText('123456')).toBeTruthy();

    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['me'] });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['wallet'] });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['subscription'] });
    });
  });

  it('renders success state for purchase flow', () => {
    mockSearchParams = new URLSearchParams({
      code: '00',
      cancel: 'false',
      orderCode: '999888',
      flow: 'purchase',
      next: '/pricing',
    });

    render(<PaymentResultClient />);

    expect(screen.getByText('Thanh toán thành công!')).toBeTruthy();
    expect(screen.getByText('Gói hội viên của bạn đã được kích hoạt thành công.')).toBeTruthy();
    expect(screen.getByText('999888')).toBeTruthy();
  });

  it('renders cancelled state when cancel is true and does not refetch', () => {
    mockSearchParams = new URLSearchParams({
      code: '00',
      cancel: 'true',
      status: 'CANCELLED',
      orderCode: '123456',
    });

    render(<PaymentResultClient />);

    expect(screen.getByText('Giao dịch đã bị hủy')).toBeTruthy();
    expect(screen.getByText(/Bạn đã hủy yêu cầu thanh toán trên PayOS/)).toBeTruthy();
    expect(mockInvalidateQueries).not.toHaveBeenCalled();
  });

  it('renders error state when code is not 00', () => {
    mockSearchParams = new URLSearchParams({
      code: '99',
      cancel: 'false',
      status: 'FAILED',
    });

    render(<PaymentResultClient />);

    expect(screen.getByText('Thanh toán không thành công')).toBeTruthy();
    expect(mockInvalidateQueries).not.toHaveBeenCalled();
  });

  it('prevents open redirect and navigates to fallback path', () => {
    mockSearchParams = new URLSearchParams({
      cancel: 'true',
      next: 'https://malicious.com',
    });

    render(<PaymentResultClient />);

    const continueButton = screen.getByRole('button', { name: /tiếp tục/i });
    fireEvent.click(continueButton);

    expect(mockReplace).toHaveBeenCalledWith('/profile?tab=wallet');
  });

  it('navigates to safe internal next path', () => {
    mockSearchParams = new URLSearchParams({
      cancel: 'true',
      next: '/pricing',
    });

    render(<PaymentResultClient />);

    const continueButton = screen.getByRole('button', { name: /tiếp tục/i });
    fireEvent.click(continueButton);

    expect(mockReplace).toHaveBeenCalledWith('/pricing');
  });
});
