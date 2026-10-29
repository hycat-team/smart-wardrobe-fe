export function isBrandFeatureEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_BRAND_FEATURES === 'true';
}
