// Chuẩn hóa backend base URL để luôn trỏ tới .../api/v1.
// - Tự thêm `/v1` còn thiếu, trim quote/slash thừa:
//   cả 2 dạng env (`.../api` hoặc `.../api/v1`) đều ra đúng `.../api/v1`.
// - Ưu tiên env server-only; giữ fallback public để không vỡ deployment cũ.
export function getBackendBaseUrl(): string {
  const raw =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_URL_V2;

  if (!raw?.trim()) {
    throw new Error(
      '[backend-url] Missing BACKEND_API_URL (or legacy NEXT_PUBLIC_API_URL).'
    );
  }

  const cleaned = raw
    .replace(/^['"]|['"]$/g, '')
    .trim()
    .replace(/\/+$/, '');

  if (cleaned.endsWith('/api/v1')) return cleaned;
  if (cleaned.endsWith('/api')) return `${cleaned}/v1`;
  // Trường hợp env chỉ là origin -> thêm /api/v1.
  return `${cleaned}/api/v1`;
}

// Host backend để log (không bao giờ throw) — giúp phân biệt
// "sai URL backend" vs "backend sập" khi đọc log production.
export function backendHostForLog(): string {
  try {
    return new URL(getBackendBaseUrl()).host;
  } catch {
    return 'unconfigured (missing BACKEND_API_URL/NEXT_PUBLIC_API_URL)';
  }
}
