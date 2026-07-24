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
}

export interface WardrobeCategoryDistributionItem {
  categoryId: string;
  categoryName: string;
  itemCount: number;
  percentage: number;
}

export interface WardrobeCategoryDistribution {
  totalItems: number;
  categories: WardrobeCategoryDistributionItem[];
}

export interface WardrobeStatsRes {
  activeItemsCount: number;
  outfitsCount: number;
}

export interface FashionItemRes {
  id: string;
  category: CategoryRes;
  imageUrl: string;
  color: string;
  colorHex: string;
  colorHue: number;
  colorSaturation: number;
  colorLightness: number;
  // imagePublicId: string;
  style: string;
  material: string;
  pattern: string;
  fit: string;
  seasonality: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface WardrobeItemRes {
  id: string;
  userId: string;
  status: WardrobeItemStatus;
  isLocked?: boolean;
  fashionItem?: FashionItemRes;
  category?: CategoryRes;
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
