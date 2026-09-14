// Chuẩn hóa backend base URL để luôn trỏ tới .../api/v1.
// - Tự thêm `/v1` còn thiếu, trim quote/slash thừa:
//   cả 2 dạng env (`.../api` hoặc `.../api/v1`) đều ra đúng `.../api/v1`.
// - QUAN TRỌNG (prod): KHÔNG fallback câm lặng về localhost.
//   Lỗi prod từng gặp: hosting không set env -> BFF fetch tới 127.0.0.1:8080
//   trong serverless function -> `ECONNREFUSED` -> login 500.
//   Ở production thiếu env sẽ throw lỗi rõ ràng để log chỉ đúng cách fix.
export function getBackendBaseUrl(): string {
  const raw = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;

  if (!raw) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        '[backend-url] Missing BACKEND_API_URL (or NEXT_PUBLIC_API_URL) in production. ' +
          'Set it to the backend base, e.g. https://<backend-host>/api/v1, and redeploy.'
      );
    }
    // Dev/local: .env thường có http://localhost:8080/api/v1
    return 'http://127.0.0.1:8080/api/v1';
  }

  const cleaned = raw
    .replace(/^['"]|['"]$/g, '')
    .trim()
    .replace(/\/+$/, '');

  if (cleaned.endsWith('/api/v1')) return cleaned;
  if (cleaned.endsWith('/api')) return `${cleaned}/v1`;
  // Trường hợp env chỉ là origin (https://closy.hycat.online) -> thêm /api/v1
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
