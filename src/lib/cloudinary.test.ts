import { applyCloudinaryTrim, deriveOriginalImageCandidates, uploadToCloudinary } from './cloudinary';

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
    jest.replaceProperty(process, 'env', {
      ...process.env,
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: 'test-cloud',
    });
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
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.cloudinary.com/v1_1/test-cloud/image/upload',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('gửi public_id và overwrite="true" khi có publicId, KHÔNG gửi field camelCase publicId', async () => {
    await uploadToCloudinary({
      file: new File(['a'], 'a.jpg', { type: 'image/jpeg' }),
      signatureParams: {
        apiKey: 'key',
        timestamp: 1,
        signature: 'sig',
        folder: 'smart_wardrobe/avatars',
        publicId: 'some-id',
      },
    });

    const fd = lastFormData();
    expect(fd.get('public_id')).toBe('some-id');
    expect(fd.get('overwrite')).toBe('true');
    expect(fd.get('publicId')).toBeNull();
    // Bắt buộc đúng 7 field: file, api_key, timestamp, signature, folder, public_id, overwrite
    expect(formKeys(fd)).toEqual([
      'api_key',
      'file',
      'folder',
      'overwrite',
      'public_id',
      'signature',
      'timestamp',
    ]);
  });

  it('không gửi allowed_formats, public_id, overwrite khi backend không ký (endpoint upload thường)', async () => {
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
    expect(fd.get('public_id')).toBeNull();
    expect(fd.get('overwrite')).toBeNull();
    expect(fd.get('allowed_formats')).toBeNull();
  });

  it('từ chối upload trước khi gọi mạng khi thiếu cloud name', async () => {
    delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME_V2;

    await expect(uploadToCloudinary({
      file: new File(['a'], 'a.jpg', { type: 'image/jpeg' }),
      signatureParams: { apiKey: 'key', timestamp: 1, signature: 'sig', folder: 'test' },
    })).rejects.toThrow('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('giữ URL ảnh gốc khi thiếu cấu hình cho transformation bên ngoài', () => {
    delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME_V2;
    const url = 'https://images.example.test/item.jpg';
    expect(applyCloudinaryTrim(url)).toBe(url);
  });

  it('dùng cloud name được cấu hình khi tạo URL transformation bên ngoài', () => {
    const url = 'https://images.example.test/item.jpg';
    expect(applyCloudinaryTrim(url)).toBe(
      `https://res.cloudinary.com/test-cloud/image/fetch/t_fetch_trim/${encodeURIComponent(url)}`,
    );
  });
});

describe('deriveOriginalImageCandidates', () => {
  // Ảnh derived `t_bg_remove` mất 10-25s mới có; ảnh gốc thì có ngay. Account bật
  // strict transformations nên chỉ phục vụ đúng đuôi thật của asset, vì vậy phải
  // thử lần lượt các đuôi thay vì bỏ hẳn phần mở rộng (bị 401).
  it('sinh các URL gốc ứng viên từ URL t_bg_remove', () => {
    const derived =
      'https://res.cloudinary.com/dzvwkngxu/image/upload/t_bg_remove/v1793870797/smart_wardrobe/items/k9jd.png';

    expect(deriveOriginalImageCandidates(derived)).toEqual([
      'https://res.cloudinary.com/dzvwkngxu/image/upload/v1793870797/smart_wardrobe/items/k9jd.webp',
      'https://res.cloudinary.com/dzvwkngxu/image/upload/v1793870797/smart_wardrobe/items/k9jd.png',
      'https://res.cloudinary.com/dzvwkngxu/image/upload/v1793870797/smart_wardrobe/items/k9jd.jpg',
      'https://res.cloudinary.com/dzvwkngxu/image/upload/v1793870797/smart_wardrobe/items/k9jd.jpeg',
    ]);
  });

  it('giữ query string khi có', () => {
    const derived =
      'https://res.cloudinary.com/demo/image/upload/t_bg_remove/v1/a/b.png?foo=bar';

    expect(deriveOriginalImageCandidates(derived)[0]).toBe(
      'https://res.cloudinary.com/demo/image/upload/v1/a/b.webp?foo=bar',
    );
  });

  it('trả về rỗng cho URL không phải t_bg_remove hoặc không phải Cloudinary', () => {
    expect(deriveOriginalImageCandidates('https://res.cloudinary.com/demo/image/upload/v1/a/b.png')).toEqual([]);
    expect(deriveOriginalImageCandidates('https://cdn.example.test/a.png')).toEqual([]);
    expect(deriveOriginalImageCandidates(undefined)).toEqual([]);
    expect(deriveOriginalImageCandidates('')).toEqual([]);
  });
});
