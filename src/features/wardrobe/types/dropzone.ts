export interface DropzoneState {
  isDragActive: boolean;
  isDragReject: boolean;
  isDisabled: boolean;
}

export type FileRejectionReason =
  | 'INVALID_TYPE'
  | 'EXCEEDS_SIZE'
  | 'EXCEEDS_COUNT'
  | 'IS_DIRECTORY'
  | 'DUPLICATE_FILE';

export interface RejectedFileItem {
  file: File;
  reason: FileRejectionReason;
  message: string;
}

export interface FileValidationOptions {
  maxFiles?: number;
  maxSizeBytes?: number;
  acceptedExtensions?: string[];
  currentCount?: number;
  existingFiles?: File[];
}

export interface FileValidationResult {
  acceptedFiles: File[];
  rejectedFiles: RejectedFileItem[];
}

export interface UseFileDropzoneOptions extends FileValidationOptions {
  onFilesDrop: (acceptedFiles: File[]) => void;
  disabled?: boolean;
}

export interface UseFileDropzoneReturn {
  isDragActive: boolean;
  isDragReject: boolean;
  getRootProps: () => {
    onDragEnter: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
}
