import { WardrobeItemRes } from '../../wardrobe/types';

export interface SaveOutfitItemReq {
  wardrobe_item_id: string;
  position_x: number;
  position_y: number;
  scale: number;
  layer_order: number;
}

export interface SaveOutfitReq {
  name: string;
  description?: string;
  cover_image_url?: string;
  items: SaveOutfitItemReq[];
}

export interface OutfitItemRes {
  id: string;
  wardrobe_item?: WardrobeItemRes;
  position_x: number;
  position_y: number;
  scale: number;
  layer_order: number;
}

export interface OutfitRes {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  cover_image_url?: string;
  status: number;
  items?: OutfitItemRes[];
  created_at: string;
  updated_at: string;
}
