import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../api/search.api';

export const SEARCH_QUERY_KEYS = {
  all: ['community-search'] as const,
  results: (params: {
    q: string;
    type?: 'all' | 'users' | 'posts';
    postType?: 'outfit' | 'media';
    page?: number;
    limit?: number;
  }) => [...SEARCH_QUERY_KEYS.all, params] as const,
};

export const useCommunitySearch = (
  params: {
    q: string;
    type?: 'all' | 'users' | 'posts';
    postType?: 'outfit' | 'media';
    page?: number;
    limit?: number;
  },
  enabled: boolean = true
) => {
  const trimmedQ = params.q.trim();

  return useQuery({
    queryKey: SEARCH_QUERY_KEYS.results({ ...params, q: trimmedQ }),
    queryFn: () => searchApi.searchCommunity({ ...params, q: trimmedQ }),
    enabled: trimmedQ.length > 0 && enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
