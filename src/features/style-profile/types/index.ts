export interface StyleProfile {
  styles: string[];
  excludedStyles: string[];
  enabled: boolean;
  personalizationAvailable: boolean;
  hasEmbedding: boolean;
  maxStyles: number;
  updatedAt: string | null;
}

export interface UpdateStyleProfileReq {
  styles?: string[];
  excludedStyles?: string[];
  enabled?: boolean;
}

export interface StyleValueSuggestion {
  value: string;
  itemCount: number;
  ratio: number;
}

export interface StyleSuggestion {
  styles: StyleValueSuggestion[];
  sampleSize: number;
}
