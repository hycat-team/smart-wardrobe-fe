import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { UseFileDropzoneOptions, UseFileDropzoneReturn } from '../types/dropzone';
import { validateDroppedFiles } from '../utils/file-validation';

export function useFileDropzone({
  onFilesDrop,
  maxFiles = 5,
  maxSizeBytes,
  acceptedExtensions,
  currentCount = 0,
  existingFiles,
  disabled = false,
}: UseFileDropzoneOptions): UseFileDropzoneReturn {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);
  const dragCounterRef = useRef(0);

  // Prevent browser from opening files dropped anywhere on the window
  useEffect(() => {
    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener('dragover', handleGlobalDragOver);
    window.addEventListener('drop', handleGlobalDrop);

    return () => {
      window.removeEventListener('dragover', handleGlobalDragOver);
      window.removeEventListener('drop', handleGlobalDrop);
    };
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      dragCounterRef.current += 1;

      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        if (currentCount >= maxFiles) {
          setIsDragReject(true);
        } else {
          setIsDragActive(true);
        }
      }
    },
    [disabled, currentCount, maxFiles]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) {
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'none';
        }
        return;
      }

      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = currentCount >= maxFiles ? 'none' : 'copy';
      }
    },
    [disabled, currentCount, maxFiles]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      dragCounterRef.current -= 1;

      if (dragCounterRef.current <= 0) {
        dragCounterRef.current = 0;
        setIsDragActive(false);
        setIsDragReject(false);
      }
    },
    [disabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      dragCounterRef.current = 0;
      setIsDragActive(false);
      setIsDragReject(false);

      if (disabled) return;

      const droppedFiles = e.dataTransfer?.files
        ? Array.from(e.dataTransfer.files)
        : [];

      if (droppedFiles.length === 0) return;

      const { acceptedFiles, rejectedFiles } = validateDroppedFiles(
        droppedFiles,
        {
          maxFiles,
          maxSizeBytes,
          acceptedExtensions,
          currentCount,
          existingFiles,
        }
      );

      // Handle rejections with friendly toasts
      const shownMessages = new Set<string>();

      rejectedFiles.forEach((rejected) => {
        if (shownMessages.has(rejected.message)) return;
        shownMessages.add(rejected.message);

        if (rejected.reason === 'EXCEEDS_COUNT') {
          toast.warning(rejected.message);
        } else if (rejected.reason === 'DUPLICATE_FILE') {
          toast.info(rejected.message);
        } else {
          toast.error(rejected.message);
        }
      });

      if (acceptedFiles.length > 0) {
        onFilesDrop(acceptedFiles);
      }
    },
    [
      disabled,
      maxFiles,
      maxSizeBytes,
      acceptedExtensions,
      currentCount,
      existingFiles,
      onFilesDrop,
    ]
  );

  const getRootProps = useCallback(
    () => ({
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    }),
    [handleDragEnter, handleDragOver, handleDragLeave, handleDrop]
  );

  return {
    isDragActive,
    isDragReject,
    getRootProps,
  };
}
