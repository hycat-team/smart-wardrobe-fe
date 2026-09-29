import { uploadToCloudinary } from './cloudinary';

function lastFormData(): FormData {
  const calls = (global.fetch as jest.Mock).mock.calls;
  const init = calls[calls.length - 1][1] as { body: FormData };
  return init.body;
}

function formKeys(fd: FormData): string[] {
  const keys: string[] = [];
  fd.forEach((_, key) => keys.push(key));
  return keys.sort();
}

describe('uploadToCloudinary form contract (Cloudinary signature)', () => {
  beforeEach(() => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ secure_url: 'https://cdn/x.jpg', public_id: 'x' }),
    })) as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('gửi allowed_formats (snake_case) nguyên văn khi backend đã ký', async () => {
    await uploadToCloudinary({
      file: new File(['a'], 'a.jpg', { type: 'image/jpeg' }),
      signatureParams: {
        apiKey: 'key',
        timestamp: 1790610642,
        signature: 'sig',
        folder: 'smart_wardrobe/posts',
        resourceType: 'image',
        allowedFormats: 'jpg,jpeg,png,webp,avif,gif',
      },
      resourceType: 'image',
    });

    const fd = lastFormData();
    // đúng 6 field đã ký + file/api_key/signature (không tính vào chữ ký)
    expect(formKeys(fd)).toEqual([
      'allowed_formats',
      'api_key',
      'file',
      'folder',
      'signature',
      'timestamp',
    ]);
    expect(fd.get('allowed_formats')).toBe('jpg,jpeg,png,webp,avif,gif');
    expect(fd.get('public_id')).toBeNull();
    expect(fd.get('publicId')).toBeNull();
  });

  it('KHÔNG gửi field camelCase publicId (làm hỏng chữ ký)', async () => {
    await uploadToCloudinary({
      file: new File(['a'], 'a.jpg', { type: 'image/jpeg' }),
      signatureParams: {
        apiKey: 'key',
        timestamp: 1,
        signature: 'sig',
        folder: 'smart_wardrobe/items',
        publicId: 'some-id',
      },
    });

    const fd = lastFormData();
    expect(fd.get('public_id')).toBe('some-id');
    expect(fd.get('publicId')).toBeNull();
  });

  it('không gửi allowed_formats khi backend không ký (endpoint cũ)', async () => {
    await uploadToCloudinary({
      file: new File(['a'], 'a.jpg', { type: 'image/jpeg' }),
      signatureParams: {
        apiKey: 'key',
        timestamp: 1,
        signature: 'sig',
        folder: 'smart_wardrobe/items',
      },
    });

    const fd = lastFormData();
    expect(formKeys(fd)).toEqual(['api_key', 'file', 'folder', 'signature', 'timestamp']);
  });
});
