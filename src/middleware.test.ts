/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { middleware } from './middleware';

function request(path: string) {
  return new NextRequest(`http://localhost${path}`);
}

describe('brand route blocking', () => {
  const originalBrandFlag = process.env.NEXT_PUBLIC_ENABLE_BRAND_FEATURES;

  afterEach(() => {
    if (originalBrandFlag === undefined) delete process.env.NEXT_PUBLIC_ENABLE_BRAND_FEATURES;
    else process.env.NEXT_PUBLIC_ENABLE_BRAND_FEATURES = originalBrandFlag;
  });

  it.each([
    '/brands',
    '/brands/demo-brand',
    '/brand',
    '/brand/demo-brand/dashboard',
    '/brand-portal',
    '/brand-portal/demo-brand/dashboard',
    '/loyalties',
  ])('redirects public brand route %s to home when disabled', async (path) => {
    process.env.NEXT_PUBLIC_ENABLE_BRAND_FEATURES = 'false';
    const response = await middleware(request(path));
    expect(response?.status).toBe(307);
    expect(response?.headers.get('location')).toBe('http://localhost/');
  });

  it('redirects admin brand management to the admin dashboard when disabled', async () => {
    process.env.NEXT_PUBLIC_ENABLE_BRAND_FEATURES = 'false';
    const response = await middleware(request('/admin/brands'));
    expect(response?.status).toBe(307);
    expect(response?.headers.get('location')).toBe('http://localhost/admin/dashboard');
  });

  it('keeps normal routes available when disabled', async () => {
    process.env.NEXT_PUBLIC_ENABLE_BRAND_FEATURES = 'false';
    const response = await middleware(request('/wardrobe'));
    expect(response?.status).toBe(200);
    expect(response?.headers.get('location')).toBeNull();
  });

  it('does not block brand routes when enabled', async () => {
    process.env.NEXT_PUBLIC_ENABLE_BRAND_FEATURES = 'true';
    const response = await middleware(request('/brands/demo-brand'));
    expect(response?.headers.get('location')).toBeNull();
  });
});
