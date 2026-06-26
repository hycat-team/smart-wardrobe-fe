export enum WardrobeItemStatus {
  InWardrobe = 0,
  Selling = 1,
  Sold = 2,
  Processing = 3,
  Failed = 4,
}

export interface CategoryRes {
  id: string;
  name: string;
  slug: string;
  sortOrder?: number;
}

export interface WardrobeItemRes {
  id: string;
  userId: string;
  category?: CategoryRes;
  color?: string;
  colorHex?: string;
  colorHue?: number;
  colorLightness?: number;
  colorSaturation?: number;
  fit?: string;
  imagePublicId?: string;
  imageUrl: string;
  isLocked?: boolean;
  material?: string;
  pattern?: string;
  seasonality?: string;
  status: WardrobeItemStatus;
  style?: string;
  price?: number;
  createdAt: string;
}

export interface SearchWardrobeItemRes {
  id: string;
  category?: CategoryRes;
  color?: string;
  colorHex?: string;
  colorHue?: number;
  colorLightness?: number;
  colorSaturation?: number;
  fit?: string;
  imagePublicId?: string;
  imageUrl: string;
  isSystem?: boolean;
  material?: string;
  pattern?: string;
  seasonality?: string;
  style?: string;
  price?: number;
}

export interface UploadSignatureResult {
  apiKey: string;
  folder: string;
  publicId?: string;
  signature: string;
  timestamp: number;
}

export interface BatchCropWardrobeItemReq {
  categoryId: string;
  imagePublicId: string;
  imageUrl: string;
}

export interface BatchCropWardrobeItemsReq {
  items: BatchCropWardrobeItemReq[];
}

export interface CloneWardrobeItemReq {
  quantity: number;
}

export interface InitClosetFromCatalogReq {
  catalogItemIds: string[];
}

export interface BulkDeleteItemsReq {
  ids: string[];
}

export interface UpdateWardrobeItemReq {
  categoryId: string;
  color: string;
  fit: string;
  material: string;
  pattern: string;
  seasonality: string;
  style: string;
  price?: number;
}
