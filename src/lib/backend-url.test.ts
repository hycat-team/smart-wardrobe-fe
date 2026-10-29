import { backendHostForLog, getBackendBaseUrl } from './backend-url';
import nextConfig from '../../next.config';

describe('backend environment configuration', () => {
  beforeEach(() => {
    jest.replaceProperty(process, 'env', { ...process.env });
    delete process.env.BACKEND_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL_V2;
  });

  afterEach(() => jest.restoreAllMocks());

  it('rejects missing configuration instead of using a built-in backend', () => {
    expect(() => getBackendBaseUrl()).toThrow('Missing BACKEND_API_URL');
    expect(backendHostForLog()).toBe('unconfigured (missing BACKEND_API_URL/NEXT_PUBLIC_API_URL)');
  });

  it.each(['', '   '])('rejects an empty configured value %j', (value) => {
    process.env.BACKEND_API_URL = value;
    expect(() => getBackendBaseUrl()).toThrow('BACKEND_API_URL');
  });

  it.each([
    'https://backend.example.test',
    'https://backend.example.test/api',
    '"https://backend.example.test/api/v1/"',
  ])('normalizes an explicitly configured backend %s', (value) => {
    process.env.BACKEND_API_URL = value;
    expect(getBackendBaseUrl()).toBe('https://backend.example.test/api/v1');
  });

  it('prioritizes the configured server-only URL', () => {
    process.env.BACKEND_API_URL = 'https://server.example.test/api/v1';
    process.env.NEXT_PUBLIC_API_URL = 'https://public.example.test/api/v1';
    process.env.NEXT_PUBLIC_API_URL_V2 = 'https://legacy.example.test/api/v1';
    expect(getBackendBaseUrl()).toBe('https://server.example.test/api/v1');
  });

  it('falls back to the legacy public URL during deployment migration', () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://public.example.test/api/v1';
    expect(getBackendBaseUrl()).toBe('https://public.example.test/api/v1');
  });

  it('supports the previous _V2 public URL as a last resort', () => {
    process.env.NEXT_PUBLIC_API_URL_V2 = 'https://legacy.example.test/api';
    expect(getBackendBaseUrl()).toBe('https://legacy.example.test/api/v1');
  });

  it('stops rewrite configuration when no backend env is available', async () => {
    await expect(nextConfig.rewrites!()).rejects.toThrow('Missing BACKEND_API_URL');
  });

  it('builds rewrite destinations from the configured backend env', async () => {
    process.env.BACKEND_API_URL = 'https://proxy.example.test/api';
    await expect(nextConfig.rewrites!()).resolves.toEqual([
      { source: '/api/v1/:path*', destination: 'https://proxy.example.test/api/v1/:path*' },
    ]);
  });
});
