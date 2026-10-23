import { backendHostForLog, getBackendBaseUrl } from './backend-url';
import nextConfig from '../../next.config';

describe('required backend environment configuration', () => {
  beforeEach(() => {
    jest.replaceProperty(process, 'env', { ...process.env });
    delete process.env.BACKEND_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL_V2;
  });

  afterEach(() => jest.restoreAllMocks());

  it('rejects missing configuration instead of using a built-in backend', () => {
    expect(() => getBackendBaseUrl()).toThrow('Missing BACKEND_API_URL or NEXT_PUBLIC_API_URL_V2');
    expect(backendHostForLog()).toBe('unconfigured (missing BACKEND_API_URL/NEXT_PUBLIC_API_URL_V2)');
  });

  it.each(['', '   '])('rejects an empty configured value %j', (value) => {
    process.env.NEXT_PUBLIC_API_URL_V2 = value;
    expect(() => getBackendBaseUrl()).toThrow('NEXT_PUBLIC_API_URL_V2');
  });

  it.each([
    'https://backend.example.test',
    'https://backend.example.test/api',
    '"https://backend.example.test/api/v1/"',
  ])('normalizes an explicitly configured backend %s', (value) => {
    process.env.NEXT_PUBLIC_API_URL_V2 = value;
    expect(getBackendBaseUrl()).toBe('https://backend.example.test/api/v1');
  });

  it('prioritizes the configured server-only URL', () => {
    process.env.BACKEND_API_URL = 'https://server.example.test/api/v1';
    process.env.NEXT_PUBLIC_API_URL_V2 = 'https://public.example.test/api/v1';
    expect(getBackendBaseUrl()).toBe('https://server.example.test/api/v1');
  });

  it('stops rewrite configuration when its required public env is missing', async () => {
    await expect(nextConfig.rewrites!()).rejects.toThrow('Missing NEXT_PUBLIC_API_URL_V2');
  });

  it('builds rewrite destinations from the configured public env', async () => {
    process.env.NEXT_PUBLIC_API_URL_V2 = 'https://proxy.example.test/api';
    await expect(nextConfig.rewrites!()).resolves.toEqual([
      { source: '/api/v1/:path*', destination: 'https://proxy.example.test/api/v1/:path*' },
    ]);
  });
});
