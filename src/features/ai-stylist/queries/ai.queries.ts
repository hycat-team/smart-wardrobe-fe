import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiApi } from "../api/ai.api";

export const aiKeys = {
  all: ["ai"] as const,
  chatSessions: () => [...aiKeys.all, "chatSessions"] as const,
  chatMessages: (contextID: string) => [...aiKeys.all, "chatMessages", contextID] as const,
};

export const useChatSessions = () => {
  return useQuery({
    queryKey: aiKeys.chatSessions(),
    queryFn: () => aiApi.getChatSessions(),
  });
};

export const useChatMessages = (contextID: string, enabled: boolean = true) => {
  return useInfiniteQuery({
    queryKey: aiKeys.chatMessages(contextID),
    queryFn: ({ pageParam = 1 }) => aiApi.getChatMessages(contextID, { page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.metadata.page < lastPage.metadata.totalPages) {
        return lastPage.metadata.page + 1;
      }
      return undefined;
    },
    enabled: !!contextID && enabled,
  });
};

export const useArchiveChatSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, title }: { sessionId: string; title?: string }) =>
      aiApi.archiveChatSession(sessionId, title ? { title } : undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiKeys.chatSessions() });
    },
  });
};
