import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

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

  console.log(`[serverFetch] BACKEND_URL=${BACKEND_URL}, token=${token ? "exists" : "missing"}, endpoint=${endpoint}`);

  try {
    // Strip quotes from BACKEND_URL if they exist
    const cleanBaseUrl = BACKEND_URL?.replace(/^'|'$/g, '')?.replace(/^"|"$/g, '');
    const url = `${cleanBaseUrl}${endpoint}`;
    console.log(`[serverFetch] Fetching: ${url}`);

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        console.warn(`[ServerFetch Warning] ${endpoint}: ${res.status} ${res.statusText}`);
      } else {
        console.error(`[ServerFetch Error] ${endpoint}: ${res.status} ${res.statusText}`);
      }
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
