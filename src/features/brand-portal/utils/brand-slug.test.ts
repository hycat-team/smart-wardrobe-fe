import {
  isReservedBrandSlug,
  isUuidLike,
  isValidBrandSlug,
  normalizeBrandSlug,
} from './brand-slug';
import { brandPortalPath, brandPublicPath } from './routes';

describe('brand-slug utils', () => {
  it('normalizes a brand name into a slug', () => {
    expect(normalizeBrandSlug('Mori Studio')).toBe('mori-studio');
    expect(normalizeBrandSlug('  Áo Dài  Studio ')).toBe('ao-dai-studio');
    expect(normalizeBrandSlug('a--b')).toBe('a-b');
  });

  it('validates slug format', () => {
    expect(isValidBrandSlug('mori-studio')).toBe(true);
    expect(isValidBrandSlug('mori_studio')).toBe(false);
    expect(isValidBrandSlug('-mori')).toBe(false);
    expect(isValidBrandSlug('Mori-Studio')).toBe(false);
    expect(isValidBrandSlug('123e4567-e89b-12d3-a456-426614174000')).toBe(false);
  });

  it('detects reserved slugs case-insensitively', () => {
    expect(isReservedBrandSlug('admin')).toBe(true);
    expect(isReservedBrandSlug(' BRAND-PORTAL ')).toBe(true);
    expect(isReservedBrandSlug('mori-studio')).toBe(false);
  });

  it('detects UUID-like values', () => {
    expect(isUuidLike('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    expect(isUuidLike('mori-studio')).toBe(false);
  });
});

describe('brand routes', () => {
  it('builds public storefront paths from a slug', () => {
    expect(brandPublicPath('mori-studio')).toBe('/brands/mori-studio');
    expect(brandPublicPath('mori-studio', 'loyalty')).toBe('/brands/mori-studio/loyalty');
  });

  it('builds brand portal paths from a slug', () => {
    expect(brandPortalPath('mori-studio')).toBe('/brand-portal/mori-studio/dashboard');
    expect(brandPortalPath('mori-studio', 'products')).toBe('/brand-portal/mori-studio/products');
  });
});
