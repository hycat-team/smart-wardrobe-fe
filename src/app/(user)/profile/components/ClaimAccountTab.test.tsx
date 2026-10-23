import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClaimAccountTab } from './ClaimAccountTab';
import api from '@/lib/axios';
import { toast } from 'sonner';

jest.mock('@/lib/axios', () => ({ __esModule: true, default: { post: jest.fn() } }));
jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

function renderClaimForm() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}><ClaimAccountTab /></QueryClientProvider>,
  );
}

describe('offline brand account linking', () => {
  beforeEach(() => jest.clearAllMocks());

  it('submits the token through the brand service and clears it after success', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { data: { id: 'customer-1' } } });
    renderClaimForm();

    expect((screen.getByRole('button', { name: 'Liên kết' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.change(screen.getByLabelText('Mã liên kết'), { target: { value: 'CLAIM-123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Liên kết' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/brands/claim', { claimToken: 'CLAIM-123' });
      expect((screen.getByLabelText('Mã liên kết') as HTMLInputElement).value).toBe('');
      expect(toast.success).toHaveBeenCalledWith('Liên kết tài khoản thành công!');
    });
  });

  it('keeps the token for correction and reports an expired token', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce({ response: { data: { message: 'Mã đã hết hạn' } } });
    renderClaimForm();
    fireEvent.change(screen.getByLabelText('Mã liên kết'), { target: { value: 'EXPIRED' } });
    fireEvent.click(screen.getByRole('button', { name: 'Liên kết' }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Mã đã hết hạn'));
    expect((screen.getByLabelText('Mã liên kết') as HTMLInputElement).value).toBe('EXPIRED');
  });
});
