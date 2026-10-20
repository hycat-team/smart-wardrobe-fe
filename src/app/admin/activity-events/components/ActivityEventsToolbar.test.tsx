import { fireEvent, render, screen } from '@testing-library/react';
import { ActivityEventsToolbar } from './ActivityEventsToolbar';

describe('ActivityEventsToolbar', () => {
  const defaultProps = {
    userId: undefined,
    activityType: undefined,
    preset: 'this_month' as const,
    fromDate: '2026-10-01',
    toDate: '2026-10-20',
    limit: 20,
    onFilterChange: jest.fn(),
    onReset: jest.fn(),
    onRefresh: jest.fn(),
    isRefreshing: false,
    errorMessage: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without error or infinite re-renders when userId is undefined (prevents Error #301)', () => {
    expect(() => {
      render(<ActivityEventsToolbar {...defaultProps} />);
    }).not.toThrow();

    const input = screen.getByRole('textbox', {
      name: /lọc theo mã người dùng uuid/i,
    }) as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('initializes with userId when provided and updates on prop change', () => {
    const { rerender } = render(
      <ActivityEventsToolbar
        {...defaultProps}
        userId="11111111-1111-1111-1111-111111111111"
      />
    );

    const input = screen.getByRole('textbox', {
      name: /lọc theo mã người dùng uuid/i,
    }) as HTMLInputElement;
    expect(input.value).toBe('11111111-1111-1111-1111-111111111111');

    // Update prop to undefined (e.g. on reset)
    rerender(<ActivityEventsToolbar {...defaultProps} userId={undefined} />);
    expect(input.value).toBe('');

    // Update prop to a different userId
    rerender(
      <ActivityEventsToolbar
        {...defaultProps}
        userId="22222222-2222-2222-2222-222222222222"
      />
    );
    expect(input.value).toBe('22222222-2222-2222-2222-222222222222');
  });

  it('handles search submission with valid UUID', () => {
    render(<ActivityEventsToolbar {...defaultProps} />);

    const input = screen.getByRole('textbox', {
      name: /lọc theo mã người dùng uuid/i,
    });
    fireEvent.change(input, {
      target: { value: '1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^tìm$/i }));

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      userId: '1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f',
      page: 1,
    });
  });

  it('displays validation error when submitting invalid UUID', () => {
    render(<ActivityEventsToolbar {...defaultProps} />);

    const input = screen.getByRole('textbox', {
      name: /lọc theo mã người dùng uuid/i,
    });
    fireEvent.change(input, { target: { value: 'invalid-uuid-string' } });
    fireEvent.click(screen.getByRole('button', { name: /^tìm$/i }));

    expect(defaultProps.onFilterChange).not.toHaveBeenCalled();
    expect(
      screen.getByText(/mã người dùng phải đúng định dạng uuid/i)
    ).toBeTruthy();
  });

  it('triggers onReset when clicking reset button', () => {
    render(<ActivityEventsToolbar {...defaultProps} />);

    const resetButton = screen.getByRole('button', { name: /đặt lại/i });
    fireEvent.click(resetButton);

    expect(defaultProps.onReset).toHaveBeenCalledTimes(1);
  });
});
