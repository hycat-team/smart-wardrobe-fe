import { validateMediaFile } from './community.utils';

function createFile(type: string, size: number, name = 'file'): File {
  return new File([new ArrayBuffer(size)], name, { type });
}

describe('validateMediaFile', () => {
  it('chấp nhận ảnh jpg/png/webp hợp lệ', async () => {
    const result = await validateMediaFile(createFile('image/jpeg', 1024, 'a.jpg'));
    expect(result.isValid).toBe(true);
    expect(result.mediaType).toBe('image');
  });

  it('chấp nhận ảnh png/webp hợp lệ', async () => {
    expect((await validateMediaFile(createFile('image/png', 1024))).mediaType).toBe('image');
    expect((await validateMediaFile(createFile('image/webp', 1024))).mediaType).toBe('image');
  });

  it('từ chối ảnh định dạng không hỗ trợ (gif/svg)', async () => {
    const gif = await validateMediaFile(createFile('image/gif', 1024, 'a.gif'));
    expect(gif.isValid).toBe(false);
    expect(gif.error).toBe('Ảnh chỉ hỗ trợ định dạng jpg, png, webp.');

    const svg = await validateMediaFile(createFile('image/svg+xml', 1024, 'a.svg'));
    expect(svg.isValid).toBe(false);
    expect(svg.error).toBe('Ảnh chỉ hỗ trợ định dạng jpg, png, webp.');
  });

  it('từ chối ảnh vượt quá 10MB', async () => {
    const result = await validateMediaFile(
      createFile('image/jpeg', 10 * 1024 * 1024 + 1, 'big.jpg')
    );
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('vượt quá dung lượng tối đa 10MB');
  });

  it('từ chối video định dạng không hỗ trợ (avi/mov)', async () => {
    const avi = await validateMediaFile(createFile('video/avi', 1024, 'a.avi'));
    expect(avi.isValid).toBe(false);
    expect(avi.error).toBe('Video chỉ hỗ trợ định dạng mp4, webm.');

    const mov = await validateMediaFile(createFile('video/quicktime', 1024, 'a.mov'));
    expect(mov.isValid).toBe(false);
    expect(mov.error).toBe('Video chỉ hỗ trợ định dạng mp4, webm.');
  });

  it('từ chối video vượt quá 100MB với thông báo chính xác', async () => {
    const bigFile = createFile('video/mp4', 100 * 1024 * 1024 + 1, 'big.mp4');
    const result = await validateMediaFile(bigFile);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Video "big.mp4" vượt quá dung lượng tối đa 100MB.');

    // Kiểm tra tệp 105MB
    const hugeFile = createFile('video/webm', 105 * 1024 * 1024, 'huge.webm');
    const hugeResult = await validateMediaFile(hugeFile);
    expect(hugeResult.isValid).toBe(false);
    expect(hugeResult.error).toBe('Video "huge.webm" vượt quá dung lượng tối đa 100MB.');

    // Kiểm tra video > 100MB có định dạng mov vẫn bị chặn bởi dung lượng trước tiên
    const bigMov = createFile('video/quicktime', 120 * 1024 * 1024, 'clip.mov');
    const movResult = await validateMediaFile(bigMov);
    expect(movResult.isValid).toBe(false);
    expect(movResult.error).toBe('Video "clip.mov" vượt quá dung lượng tối đa 100MB.');
  });

  it('chấp nhận video đúng ngưỡng 100MB (104,857,600 bytes) và thời lượng <= 60s', async () => {
    mockVideoDuration(30);
    const boundaryFile = createFile('video/mp4', 100 * 1024 * 1024, 'boundary.mp4');
    const result = await validateMediaFile(boundaryFile);
    expect(result.isValid).toBe(true);
    expect(result.mediaType).toBe('video');
  });

  it('từ chối tệp không phải ảnh/video', async () => {
    const result = await validateMediaFile(createFile('application/pdf', 1024, 'doc.pdf'));
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Định dạng tệp không được hỗ trợ');
  });

  it('chấp nhận video mp4 hợp lệ (≤100MB, ≤60s)', async () => {
    mockVideoDuration(45);
    const result = await validateMediaFile(createFile('video/mp4', 1024, 'ok.mp4'));
    expect(result.isValid).toBe(true);
    expect(result.mediaType).toBe('video');
  });

  it('từ chối video vượt quá 60 giây', async () => {
    mockVideoDuration(75);
    const result = await validateMediaFile(createFile('video/mp4', 1024, 'long.mp4'));
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('vượt quá giới hạn tối đa 60 giây');
  });
});

/**
 * Giả lập phần tử <video> cho jsdom (không load metadata thật):
 * - mock URL.createObjectURL / revokeObjectURL
 * - mock document.createElement('video') trả về object có duration cho trước
 *   và tự kích hoạt onloadedmetadata
 */
function mockVideoDuration(duration: number) {
  window.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
  window.URL.revokeObjectURL = jest.fn();

  const origCreateElement = document.createElement.bind(document);
  const fakeVideo = {
    preload: '',
    duration,
    onloadedmetadata: null as null | (() => void),
    onerror: null as null | (() => void),
  };
  jest.spyOn(document, 'createElement').mockImplementation(((tagName: string) => {
    if (tagName === 'video') {
      queueMicrotask(() => fakeVideo.onloadedmetadata?.());
      return fakeVideo as unknown as HTMLElement;
    }
    return origCreateElement(tagName as keyof HTMLElementTagNameMap);
  }) as typeof document.createElement);
}

afterEach(() => {
  jest.restoreAllMocks();
});