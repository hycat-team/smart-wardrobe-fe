import { WardrobeItemRes } from '@/features/wardrobe/types';

export interface AIOutfitRecommendationReq {
  occasion?: string;
  styleTarget?: string;
  season?: string;
  weather?: string;
  colorTone?: string;
  details?: string;
  include_brand_items?: boolean;
}

export interface AIOutfitItem {
  role: string;
  itemContext?: string;
  primary: AIOutfitProduct;
  alternatives: AIOutfitProduct[];
}

export interface AIOutfitProduct extends WardrobeItemRes {
  name?: string;
  description?: string;
  brandId?: string;
  brandName?: string;
  brandItemId?: string;
  itemContext?: string;
  brandItem?: {
    id: string;
    brandId: string;
    brandName?: string;
    itemType?: string;
    name?: string;
    price?: number;
  };
}

export interface AIOutfitRecommendationRes {
  title: string;
  explanation: string;
  isFallback: boolean;
  remainingQuota: number;
  items: AIOutfitItem[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export interface ChatStreamReq {
  content: string;
}

export interface CreateChatSessionReq {
  title?: string;
}

export interface ChatSessionRes {
  id: string;
  title: string;
  contextSummary: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MessageSender = 'USER' | 'SYSTEM' | 'ASSISTANT';

export interface ChatMessageRes {
  id: string;
  content: string;
  sender: MessageSender;
  createdAt: string;
}
