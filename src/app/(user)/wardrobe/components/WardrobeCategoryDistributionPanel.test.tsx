import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { WardrobeCategoryDistributionPanel } from './WardrobeCategoryDistributionPanel';
import type { WardrobeCategoryDistribution } from '@/features/wardrobe/types';

jest.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
      style,
      whileHover,
      whileTap,
      initial,
      animate,
      exit,
      transition,
      ...props
    }: any) => (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}));

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }: any) => <svg data-testid="pie-chart">{children}</svg>,
  Pie: ({ children }: any) => <g data-testid="pie">{children}</g>,
  Cell: () => <circle />,
  Tooltip: () => null,
}));

const mockData: WardrobeCategoryDistribution = {
  totalItems: 74,
  categories: [
    { categoryId: 'cat-1', categoryName: 'Áo', itemCount: 27, percentage: 36.5 },
    { categoryId: 'cat-2', categoryName: 'Quần', itemCount: 19, percentage: 25.7 },
    { categoryId: 'cat-3', categoryName: 'Phụ kiện', itemCount: 10, percentage: 13.5 },
    { categoryId: 'cat-4', categoryName: 'Giày', itemCount: 10, percentage: 13.5 },
    { categoryId: 'cat-5', categoryName: 'Đầm', itemCount: 8, percentage: 10.8 },
  ],
};

describe('WardrobeCategoryDistributionPanel', () => {
  it('renders summary bar with total items and category count', () => {
    render(
      <WardrobeCategoryDistributionPanel
        data={mockData}
        isLoading={false}
        isFetching={false}
        error={null}
        onRetry={jest.fn()}
      />
    );

    expect(screen.getByText('Phân bổ tủ đồ')).toBeTruthy();
    expect(screen.getByText('Wardrobe analytics')).toBeTruthy();
    expect(screen.getByText('74')).toBeTruthy();
    expect(screen.getByText('5 phân loại')).toBeTruthy();
  });

  it('expands when hovered and reveals categories and percentages', () => {
    const { container } = render(
      <WardrobeCategoryDistributionPanel
        data={mockData}
        isLoading={false}
        isFetching={false}
        error={null}
        onRetry={jest.fn()}
      />
    );

    const section = container.querySelector('section');
    expect(section).toBeTruthy();

    // Hover
    fireEvent.mouseEnter(section!);

    expect(screen.getAllByText('Áo').length).toBeGreaterThan(0);
    expect(screen.getByText('27')).toBeTruthy();
    expect(screen.getByText('36,5%')).toBeTruthy();
    expect(screen.getByText('Quần')).toBeTruthy();
    expect(screen.getByText('19')).toBeTruthy();
    expect(screen.getByText('25,7%')).toBeTruthy();
  });

  it('allows pinning open via click on header or pin button', () => {
    const { container } = render(
      <WardrobeCategoryDistributionPanel
        data={mockData}
        isLoading={false}
        isFetching={false}
        error={null}
        onRetry={jest.fn()}
      />
    );

    const headerButton = screen.getByRole('button', { name: /phân bổ tủ đồ/i });
    expect(headerButton.getAttribute('aria-expanded')).toBe('false');

    // Click to pin open
    fireEvent.click(headerButton);
    expect(headerButton.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getAllByText('Áo').length).toBeGreaterThan(0);

    // Mouse leave does NOT close when pinned
    const section = container.querySelector('section');
    fireEvent.mouseLeave(section!);
    expect(headerButton.getAttribute('aria-expanded')).toBe('true');
  });

  it('renders empty message when no items exist', () => {
    render(
      <WardrobeCategoryDistributionPanel
        data={{ totalItems: 0, categories: [] }}
        isLoading={false}
        isFetching={false}
        error={null}
        onRetry={jest.fn()}
      />
    );

    // Expand
    const headerButton = screen.getByRole('button', { name: /phân bổ tủ đồ/i });
    fireEvent.click(headerButton);

    expect(screen.getByText('Thêm trang phục để bắt đầu xem phân bổ tủ đồ.')).toBeTruthy();
  });
});
