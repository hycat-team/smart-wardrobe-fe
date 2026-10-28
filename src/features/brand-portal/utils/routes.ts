export const BRAND_PORTAL_HUB = '/brand-portal';
export const BRAND_PORTAL_REGISTER = '/brand-portal/register';

export function brandPublicPath(brandSlug: string, subPath = '') {
  const suffix = subPath ? `/${subPath.replace(/^\/+/, '')}` : '';
  return `/brands/${brandSlug}${suffix}`;
}

export function brandPortalPath(brandSlug: string, subPath = 'dashboard') {
  return `${BRAND_PORTAL_HUB}/${brandSlug}/${subPath}`;
}
