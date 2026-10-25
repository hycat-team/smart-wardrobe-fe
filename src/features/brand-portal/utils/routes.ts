export const BRAND_PORTAL_HUB = '/brand-portal';
export const BRAND_PORTAL_REGISTER = '/brand-portal/register';

export function brandPortalPath(brandId: string, subPath = 'dashboard') {
  return `${BRAND_PORTAL_HUB}/${brandId}/${subPath}`;
}
