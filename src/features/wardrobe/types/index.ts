export enum WardrobeItemStatus {
  InWardrobe = 0,
  Selling = 1,
  Sold = 2,
  Processing = 3,
  Failed = 4,
  NeedsReview = 5,
}

export interface CategoryRes {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryBriefRes {
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

export interface BrandItemBriefRes {
  brandId?: string;
  brandName?: string;
  id?: string;
  imageUrl?: string;
  name?: string;
  price?: number;
}

export interface FashionItemBriefRes {
  id: string;
  imageUrl?: string;
  color?: string;
  colorHex?: string;
  style?: string;
  category?: CategoryBriefRes;
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
  style: string;
  material: string;
  pattern: string;
  fit: string;
  seasonality: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface WardrobeItemBriefRes {
  id: string;
  status: WardrobeItemStatus;
  taskId?: string;
  price?: number;
  isLocked?: boolean;
  lastUsedAt?: string;
  brandItem?: BrandItemBriefRes;
  fashionItem?: FashionItemBriefRes;
}

export interface WardrobeItemRes {
  id: string;
  userId?: string;
  status: WardrobeItemStatus;
  isLocked?: boolean;
  isDeleted?: boolean;
  itemContext?: string;
  lastUsedAt?: string;
  taskId?: string;
  fashionItem?: FashionItemRes;
  category?: CategoryRes;
  brandItem?: BrandItemBriefRes;
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

export interface WardrobeBatchUploadItemReq {
  categoryId?: string;
  imagePublicId: string;
  imageUrl: string;
}

export interface BatchUploadWardrobeItemsReq {
  items: WardrobeBatchUploadItemReq[];
}

// Alias for backward compatibility
export type BatchCropWardrobeItemReq = WardrobeBatchUploadItemReq;
export type BatchCropWardrobeItemsReq = BatchUploadWardrobeItemsReq;

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
  color?: string;
  fit?: string;
  material?: string;
  pattern?: string;
  seasonality?: string;
  style?: string;
  price?: number;
}

export type AnalyzeTaskStatusType = "completed" | "failed" | "needs_review" | string;

export interface WardrobeTaskSSEPayload {
  itemId: string;
  status: AnalyzeTaskStatusType;
  total: number;
  index: number;
  data?: WardrobeItemBriefRes | WardrobeItemRes | any;
  error?: string;
  // Fallbacks for backward compatibility
  taskId?: string;
  progress?: number;
  item?: WardrobeItemBriefRes | WardrobeItemRes;
  message?: string;
}


