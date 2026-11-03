export interface SaveOutfitItemReq {
  fashionItemId: string;
  itemContext?: "user_wardrobe" | "brand_item" | "system_catalog";
  positionX: number;
  positionY: number;
  scale: number;
  layerOrder: number;
}

export interface SaveOutfitReq {
  name: string;
  description?: string;
  coverImageUrl?: string;
  coverPublicId?: string;
  items: SaveOutfitItemReq[];
}

export interface OutfitItemRes {
  id: string;
  itemContext?: string;
  fashionItem?: any;
  isAvailable?: boolean;
  positionX: number;
  positionY: number;
  scale: number;
  layerOrder: number;
}

export interface OutfitRes {
  id: string;
  userId: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  coverPublicId?: string;
  status: number;
  items?: OutfitItemRes[];
  createdAt: string;
  updatedAt: string;
}
