import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Sidebar } from './sidebar';
import { MobileBottomNav } from './mobile-nav';
import { GuestHeader } from './guest-header';
import { AdminSidebar } from '@/features/admin/components/AdminSidebar';
import BrandLayout from '@/app/brand-portal/[brandSlug]/layout';
import { BrandRedirector } from '@/app/(user)/components/BrandRedirector';

let mockPathname = '/wardrobe';
let mockMemberRole = 'owner';
const mockRouterPush = jest.fn();
const mockAuthState = {
  user: {
    username: 'shopper',
    firstName: 'Người dùng',
    lastName: 'Dùng',
    roleSlug: 'user',
    isPremium: true,
  },
  logout: jest.fn(),
};

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push: mockRouterPush, replace: jest.fn() }),
  useParams: () => ({ brandSlug: 'brand-1' }),
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <div role="img" aria-label={alt} />,
}));
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className}>{children}</div>
    ),
    span: ({ children, className }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span className={className}>{children}</span>
    ),
  },
}));
jest.mock('@/store/useAuthStore', () => ({
  useAuthStore: (selector: (state: typeof mockAuthState) => unknown) => selector(mockAuthState),
}));
jest.mock('@/store/useSidebarStore', () => ({
  useSidebarStore: () => ({
    isCollapsed: false,
    setIsCollapsed: jest.fn(),
    toggleCollapse: jest.fn(),
  }),
}));
jest.mock('@/features/auth/queries/auth.queries', () => ({
  useLogout: () => ({ mutate: jest.fn() }),
}));
jest.mock('@/features/brand-portal/queries/brand-portal.queries', () => ({
  useGetBrandProfile: () => ({
    data: { id: 'brand-1', name: 'Closy Brand', memberRole: mockMemberRole },
    isLoading: false,
  }),
  useGetMyBrands: () => ({
    data: [
      { id: 'brand-1', name: 'Closy Brand', status: 'ACTIVE', memberRole: mockMemberRole, memberStatus: 'active' },
      { id: 'brand-2', name: 'Second Brand', status: 'ACTIVE', memberRole: 'owner', memberStatus: 'active' },
    ],
    isLoading: false,
  }),
}));

describe('brand navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockPathname = '/wardrobe';
    mockMemberRole = 'owner';
    mockAuthState.user.lastName = 'Dùng';
  });

  it('exposes discovery and the brand portal on desktop', () => {
    render(<Sidebar />);

    expect(screen.getByRole('link', { name: 'Khám Phá' }).getAttribute('href')).toBe('/brands');
    expect(screen.getByRole('link', { name: 'Kênh Thương Hiệu' }).getAttribute('href')).toBe('/brand-portal');
    expect(screen.queryByRole('button', { name: 'Giỏ Hàng' })).toBeNull();
  });

  it('keeps all four primary destinations on mobile and opens brand destinations from More', async () => {
    render(<MobileBottomNav />);

    for (const [label, path] of [
      ['Cộng Đồng', '/community'],
      ['Tủ Quần Áo', '/wardrobe'],
      ['AI Phối Đồ', '/ai-stylist'],
      ['Trang Phục', '/outfits'],
      ['Hồ sơ', '/profile'],
    ]) {
      expect(screen.getByRole('link', { name: label }).getAttribute('href')).toBe(path);
    }

    fireEvent.keyDown(screen.getByRole('button', { name: 'Thêm chức năng thương hiệu' }), { key: 'Enter' });
    expect((await screen.findByRole('menuitem', { name: 'Khám Phá' })).getAttribute('href')).toBe('/brands');
    expect(screen.getByRole('menuitem', { name: 'Kênh Thương Hiệu' }).getAttribute('href')).toBe('/brand-portal');
  });

  it('exposes the brand portal on the landing page for signed-in users', () => {
    mockPathname = '/';
    render(<GuestHeader />);
    expect(screen.getAllByRole('link', { name: 'Kênh Thương Hiệu' }).length).toBeGreaterThan(0);
  });

  it('exposes brand approval in the admin navigation', () => {
    render(<AdminSidebar />);
    expect(screen.getByRole('link', { name: 'Duyệt thương hiệu' }).getAttribute('href')).toBe('/admin/brands');
  });

  it('keeps the brand workspace navigation free of removed mock routes', async () => {
    mockPathname = '/brand-portal/brand-1/dashboard';
    render(<BrandLayout><p>Dashboard</p></BrandLayout>);

    expect(screen.getAllByRole('link', { name: 'Sản phẩm' })[0].getAttribute('href')).toBe('/brand-portal/brand-1/products');
    expect(screen.queryByRole('link', { name: 'Đơn hàng' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Bài viết' })).toBeNull();
    expect(screen.getAllByRole('button', { name: /Chọn thương hiệu đang quản lý/ }).length).toBeGreaterThan(0);
    fireEvent.keyDown(screen.getAllByRole('button', { name: 'Tài khoản thương hiệu Closy Brand' })[0], { key: 'Enter' });
    expect((await screen.findByRole('menuitem', { name: 'Hồ sơ thương hiệu' })).getAttribute('href')).toBe('/brand-portal/brand-1/profile');
  });

  it('preserves staff restrictions when brand navigation is restored', () => {
    mockMemberRole = 'staff';
    render(<BrandLayout><p>Dashboard</p></BrandLayout>);

    for (const label of ['Thành viên', 'Loyalty & Quyền lợi']) {
      expect(screen.getAllByRole('link', { name: label }).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByRole('link', { name: 'Sản phẩm' }).length).toBeGreaterThan(0);
  });

  it('routes legacy brand accounts through the brand entry page', () => {
    mockAuthState.user.lastName = 'brand';
    render(<BrandRedirector />);
    expect(mockRouterPush).toHaveBeenCalledWith('/brand-portal');
  });
});
