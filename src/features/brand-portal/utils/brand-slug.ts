export const BRAND_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const RESERVED_BRAND_SLUGS = [
  'admin',
  'ai-stylist',
  'api',
  'auth',
  'brand',
  'brand-portal',
  'brands',
  'cart',
  'checkout',
  'community',
  'delete-account',
  'loyalties',
  'marketplace',
  'payment',
  'posts',
  'pricing',
  'privacy',
  'products',
  'profile',
  'returns',
  'support',
  'users',
  'wardrobe',
  'workpage',
] as const;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function normalizeBrandSlug(raw: string): string {
  return raw
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

export function isReservedBrandSlug(slug: string): boolean {
  return (RESERVED_BRAND_SLUGS as readonly string[]).includes(slug.trim().toLowerCase());
}

export function isValidBrandSlug(slug: string): boolean {
  const value = slug.trim();
  return (
    value.length >= 2 &&
    value.length <= 100 &&
    BRAND_SLUG_PATTERN.test(value) &&
    !UUID_PATTERN.test(value)
  );
}

export function isUuidLike(value: string): boolean {
  return UUID_PATTERN.test(value);
}
