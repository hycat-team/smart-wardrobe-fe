import { fireEvent, render, screen } from '@testing-library/react';
import { StyleProfileClient } from './StyleProfileClient';
import { useStyleSuggestions } from '@/features/style-profile/queries/style-profile.queries';

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

jest.mock('@/features/style-profile/queries/style-profile.queries', () => ({
  useStyleProfile: () => ({
    data: {
      styles: [],
      excludedStyles: [],
      enabled: true,
      personalizationAvailable: true,
      hasEmbedding: true,
      maxStyles: 4,
      updatedAt: '2026-11-01T00:00:00.000Z',
    },
    isLoading: false,
  }),
  useStyleSuggestions: jest.fn(),
  useUpdateStyleProfile: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useDeleteStyleProfile: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));

const mockedUseStyleSuggestions = useStyleSuggestions as jest.Mock;

function buildSuggestions(count: number) {
  return {
    styles: Array.from({ length: count }, (_, index) => ({
      value: `style-${index + 1}`,
      itemCount: count - index,
      ratio: (count - index) / count,
    })),
    sampleSize: count,
  };
}

describe('StyleProfileClient wardrobe suggestions pagination', () => {
  beforeEach(() => {
    mockedUseStyleSuggestions.mockReturnValue({
      data: buildSuggestions(25),
      isLoading: false,
    });
  });

  it('shows 10 suggestions initially and 10 more on each "Thêm…" click', () => {
    render(<StyleProfileClient />);

    expect(screen.getAllByRole('button', { name: /vào gu$/ })).toHaveLength(10);

    fireEvent.click(screen.getByRole('button', { name: 'Thêm…' }));
    expect(screen.getAllByRole('button', { name: /vào gu$/ })).toHaveLength(20);

    fireEvent.click(screen.getByRole('button', { name: 'Thêm…' }));
    expect(screen.getAllByRole('button', { name: /vào gu$/ })).toHaveLength(25);
    expect(screen.queryByRole('button', { name: 'Thêm…' })).toBeNull();
  });
});
