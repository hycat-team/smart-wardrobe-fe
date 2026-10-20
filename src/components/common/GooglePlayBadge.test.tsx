import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GooglePlayBadge, OFFICIAL_GOOGLE_PLAY_URL } from './GooglePlayBadge';

describe('GooglePlayBadge', () => {
  it('renders correctly with default props', () => {
    render(<GooglePlayBadge />);

    const badgeLink = screen.getByRole('link', {
      name: /tải ứng dụng closy trên google play/i,
    });
    expect(badgeLink).toBeTruthy();
    expect(badgeLink.getAttribute('href')).toBe(OFFICIAL_GOOGLE_PLAY_URL);
    expect(badgeLink.getAttribute('target')).toBe('_blank');
    expect(badgeLink.getAttribute('rel')).toBe('noopener noreferrer');

    expect(screen.getByText('TẢI TRÊN')).toBeTruthy();
    expect(screen.getByText('Google Play')).toBeTruthy();
  });

  it('renders with English locale when specified', () => {
    render(<GooglePlayBadge locale="en" />);

    expect(screen.getByText('GET IT ON')).toBeTruthy();
    expect(screen.getByText('Google Play')).toBeTruthy();
    expect(
      screen.getByRole('link', { name: /get closy on google play/i })
    ).toBeTruthy();
  });

  it('accepts a custom href and custom className', () => {
    const customUrl = 'https://custom-play-store-link.com';
    render(<GooglePlayBadge href={customUrl} className="custom-class" />);

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe(customUrl);
    expect(link.className.includes('custom-class')).toBe(true);
  });

  it('renders official SVG icon with aria-hidden="true"', () => {
    const { container } = render(<GooglePlayBadge />);

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.querySelectorAll('path').length).toBe(4);
  });

  it('handles click callback correctly', () => {
    const handleClick = jest.fn();
    render(<GooglePlayBadge onClick={handleClick} />);

    const link = screen.getByRole('link');
    fireEvent.click(link);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
