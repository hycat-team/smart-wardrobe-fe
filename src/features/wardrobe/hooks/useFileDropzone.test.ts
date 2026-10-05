import { renderHook, act } from '@testing-library/react';
import { useFileDropzone } from './useFileDropzone';
import { toast } from 'sonner';

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

describe('useFileDropzone hook', () => {
  const onFilesDrop = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockDragEvent = (overrides?: Partial<React.DragEvent>): React.DragEvent =>
    ({
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: {
        items: [{ kind: 'file', type: 'image/png' }],
        files: [],
        dropEffect: 'none',
      },
      ...overrides,
    } as unknown as React.DragEvent);

  it('should initialize with default states', () => {
    const { result } = renderHook(() => useFileDropzone({ onFilesDrop }));

    expect(result.current.isDragActive).toBe(false);
    expect(result.current.isDragReject).toBe(false);
    expect(typeof result.current.getRootProps).toBe('function');
  });

  it('should set isDragActive on dragenter and reset on dragleave', () => {
    const { result } = renderHook(() => useFileDropzone({ onFilesDrop }));
    const rootProps = result.current.getRootProps();

    act(() => {
      rootProps.onDragEnter(createMockDragEvent());
    });
    expect(result.current.isDragActive).toBe(true);
    expect(result.current.isDragReject).toBe(false);

    act(() => {
      rootProps.onDragLeave(createMockDragEvent());
    });
    expect(result.current.isDragActive).toBe(false);
  });

  it('should not flicker when dragenter and dragleave occur on nested elements', () => {
    const { result } = renderHook(() => useFileDropzone({ onFilesDrop }));
    const rootProps = result.current.getRootProps();

    // Enter parent
    act(() => {
      rootProps.onDragEnter(createMockDragEvent());
    });
    expect(result.current.isDragActive).toBe(true);

    // Enter child (counter = 2)
    act(() => {
      rootProps.onDragEnter(createMockDragEvent());
    });
    expect(result.current.isDragActive).toBe(true);

    // Leave child back to parent (counter = 1) -> should STILL be active
    act(() => {
      rootProps.onDragLeave(createMockDragEvent());
    });
    expect(result.current.isDragActive).toBe(true);

    // Leave parent completely (counter = 0) -> now inactive
    act(() => {
      rootProps.onDragLeave(createMockDragEvent());
    });
    expect(result.current.isDragActive).toBe(false);
  });

  it('should set isDragReject when currentCount is already at maxFiles', () => {
    const { result } = renderHook(() =>
      useFileDropzone({ onFilesDrop, currentCount: 5, maxFiles: 5 })
    );
    const rootProps = result.current.getRootProps();

    act(() => {
      rootProps.onDragEnter(createMockDragEvent());
    });

    expect(result.current.isDragReject).toBe(true);
    expect(result.current.isDragActive).toBe(false);
  });

  it('should accept valid images on drop and call onFilesDrop', () => {
    const { result } = renderHook(() => useFileDropzone({ onFilesDrop }));
    const rootProps = result.current.getRootProps();

    const file1 = new File(['content1'], 'shirt.png', { type: 'image/png' });
    const file2 = new File(['content2'], 'pants.jpg', { type: 'image/jpeg' });

    const dropEvent = createMockDragEvent({
      dataTransfer: {
        files: [file1, file2] as unknown as FileList,
      } as unknown as DataTransfer,
    });

    act(() => {
      rootProps.onDrop(dropEvent);
    });

    expect(onFilesDrop).toHaveBeenCalledTimes(1);
    expect(onFilesDrop).toHaveBeenCalledWith([file1, file2]);
    expect(result.current.isDragActive).toBe(false);
  });

  it('should filter non-image files and trigger toast.error', () => {
    const { result } = renderHook(() => useFileDropzone({ onFilesDrop }));
    const rootProps = result.current.getRootProps();

    const textFile = new File(['text'], 'notes.txt', { type: 'text/plain' });
    const imageFile = new File(['image'], 'dress.png', { type: 'image/png' });

    const dropEvent = createMockDragEvent({
      dataTransfer: {
        files: [textFile, imageFile] as unknown as FileList,
      } as unknown as DataTransfer,
    });

    act(() => {
      rootProps.onDrop(dropEvent);
    });

    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining('không phải ảnh hợp lệ')
    );
    expect(onFilesDrop).toHaveBeenCalledWith([imageFile]);
  });

  it('should filter files exceeding 5MB and trigger toast.error', () => {
    const { result } = renderHook(() => useFileDropzone({ onFilesDrop }));
    const rootProps = result.current.getRootProps();

    // 6MB file
    const bigFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'huge.png', {
      type: 'image/png',
    });
    const normalFile = new File(['content'], 'normal.png', {
      type: 'image/png',
    });

    const dropEvent = createMockDragEvent({
      dataTransfer: {
        files: [bigFile, normalFile] as unknown as FileList,
      } as unknown as DataTransfer,
    });

    act(() => {
      rootProps.onDrop(dropEvent);
    });

    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining('vượt quá dung lượng tối đa 5MB')
    );
    expect(onFilesDrop).toHaveBeenCalledWith([normalFile]);
  });

  it('should slice excess files to respect maxFiles limit and trigger toast.warning', () => {
    const { result } = renderHook(() =>
      useFileDropzone({ onFilesDrop, currentCount: 3, maxFiles: 5 })
    );
    const rootProps = result.current.getRootProps();

    // User drops 4 files when only 2 slots are available
    const files = [
      new File(['1'], 'img1.png', { type: 'image/png' }),
      new File(['2'], 'img2.png', { type: 'image/png' }),
      new File(['3'], 'img3.png', { type: 'image/png' }),
      new File(['4'], 'img4.png', { type: 'image/png' }),
    ];

    const dropEvent = createMockDragEvent({
      dataTransfer: {
        files: files as unknown as FileList,
      } as unknown as DataTransfer,
    });

    act(() => {
      rootProps.onDrop(dropEvent);
    });

    expect(toast.warning).toHaveBeenCalledWith(
      expect.stringContaining('Đã nhận thêm 2 ảnh để đạt giới hạn 5 ảnh')
    );
    expect(onFilesDrop).toHaveBeenCalledWith([files[0], files[1]]);
  });

  it('should ignore drops when disabled is true', () => {
    const { result } = renderHook(() =>
      useFileDropzone({ onFilesDrop, disabled: true })
    );
    const rootProps = result.current.getRootProps();

    const file = new File(['content'], 'shirt.png', { type: 'image/png' });
    const dropEvent = createMockDragEvent({
      dataTransfer: {
        files: [file] as unknown as FileList,
      } as unknown as DataTransfer,
    });

    act(() => {
      rootProps.onDrop(dropEvent);
    });

    expect(onFilesDrop).not.toHaveBeenCalled();
    expect(result.current.isDragActive).toBe(false);
  });
});
