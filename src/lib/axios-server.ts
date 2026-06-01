import axios from 'axios';
import { cookies } from 'next/headers';

export const createServerApi = () => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
    timeout: 10000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use(
    (config) => {
      // In Next.js App Router Server Components, cookies() is read-only
      const cookieStore = cookies();
      const token = cookieStore.get('accessToken')?.value;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api;
};
