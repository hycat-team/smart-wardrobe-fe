// Chuẩn hóa backend base URL để luôn trỏ tới .../api/v1.
// Nguyên nhân lỗi 500 ở production: NEXT_PUBLIC_API_URL/BACKEND_API_URL
// có thể được set là `https://closy.hycat.online/api` (thiếu `/v1`),
// khiến BFF fetch tới `.../api/auth/login` thay vì `.../api/v1/auth/login`.
// Helper này tự thêm `/v1` còn thiếu, trim quote/slash thừa,
// nên cả 2 dạng env (`/api` hoặc `/api/v1`) đều ra đúng `.../api/v1`.
export function getBackendBaseUrl(): string {
  const raw =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:8080/api/v1';

  const cleaned = raw
    .replace(/^['"]|['"]$/g, '')
    .trim()
    .replace(/\/+$/, '');

  if (cleaned.endsWith('/api/v1')) return cleaned;
  if (cleaned.endsWith('/api')) return `${cleaned}/v1`;
  // Trường hợp env chỉ là origin (https://closy.hycat.online) -> thêm /api/v1
  return `${cleaned}/api/v1`;
}

// Chuẩn hóa destination cho next.config.ts rewrites:
// env có thể đã chứa /api/v1 -> tránh tạo ra /api/v1/api/v1 (double prefix).
export function getProxyDestinationBase(): string {
  const base = getBackendBaseUrl();
  // rewrite dùng pattern `/api/v1/:path*` -> destination cần `${base}/:path*`
  // (base đã kết thúc bằng /api/v1 nên chỉ cần append /:path* ở caller)
  return base;
}
