import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

/**
 * Hàm fetch tùy chỉnh dành riêng cho Server Components.
 * Tự động gắn HttpOnly `accessToken` từ cookies vào Header.
 */
export async function serverFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const headers = new Headers(options?.headers);
  // Cài đặt Content-Type mặc định nếu chưa có
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Tự động gắn Token nếu có
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      console.error(`[ServerFetch Error] ${endpoint}: ${res.status} ${res.statusText}`);
      // Có thể throw error tùy vào logic xử lý lỗi bạn muốn
      return null;
    }

    const data = await res.json();
    // API backend của bạn trả về { data: T, message: string }
    return data.data as T;
  } catch (error) {
    console.error(`[ServerFetch Exception] ${endpoint}:`, error);
    return null;
  }
}
