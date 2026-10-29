import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminPeriodNavigator } from '../AdminPeriodNavigator';

describe('AdminPeriodNavigator Component', () => {
  const defaultProps = {
    preset: 'this_month' as const,
    fromDate: '2026-10-01',
    toDate: '2026-10-20',
    onChange: jest.fn(),
  };

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-10-20T10:00:00+07:00'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all 5 preset buttons and period label', () => {
    render(<AdminPeriodNavigator {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Hôm nay' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Tuần này' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Tháng này' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Năm này' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Tuỳ chọn' })).toBeTruthy();

    // Check period label
    expect(
      screen.getByText(/Tháng 10\/2026 · 01\/10 – 20\/10\/2026/)
    ).toBeTruthy();
  });

  it('fires onChange immediately when clicking a preset button', () => {
    render(<AdminPeriodNavigator {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Hôm nay' }));
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        preset: 'today',
      })
    );

    fireEvent.click(screen.getByRole('button', { name: 'Tuần này' }));
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        preset: 'this_week',
      })
    );
  });

  it('navigates to previous period on clicking ◀', () => {
    render(<AdminPeriodNavigator {...defaultProps} />);

    const prevButton = screen.getByRole('button', { name: 'Kỳ trước' });
    fireEvent.click(prevButton);

    expect(defaultProps.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        preset: 'this_month',
        fromDate: '2026-09-01',
        toDate: '2026-09-30',
      })
    );
  });

  it('disables ▶ button when at current period', () => {
    render(<AdminPeriodNavigator {...defaultProps} />);

    const nextButton = screen.getByRole('button', {
      name: 'Kỳ sau',
    }) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(true);
    expect(nextButton.getAttribute('aria-disabled')).toBe('true');
  });

  it('enables ▶ button when viewing past period and navigates forward on click', () => {
    render(
      <AdminPeriodNavigator
        preset="this_month"
        fromDate="2026-08-01"
        toDate="2026-08-31"
        onChange={defaultProps.onChange}
      />
    );

    const nextButton = screen.getByRole('button', {
      name: 'Kỳ sau',
    }) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(false);

    fireEvent.click(nextButton);
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        preset: 'this_month',
        fromDate: '2026-09-01',
        toDate: '2026-09-30',
      })
    );
  });

  it('displays loading spinner when isLoading is true', () => {
    render(<AdminPeriodNavigator {...defaultProps} isLoading={true} />);

    expect(
      screen.getByRole('region', { name: 'Bộ điều hướng kỳ thời gian' })
    ).toBeTruthy();
  });
});
