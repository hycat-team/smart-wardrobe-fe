import api from '@/lib/axios';
import { APIResponse } from '@/types/api';
import { AIOutfitRecommendationReq, AIOutfitRecommendationRes, CreateChatSessionReq, ChatSessionRes } from '../types';

export const aiApi = {
  getOutfitRecommendation: async (data: AIOutfitRecommendationReq): Promise<AIOutfitRecommendationRes> => {
    // AI processing can take a while, increase timeout to 60 seconds
    const res = await api.post<APIResponse<AIOutfitRecommendationRes>>('/ai/outfit-recommendations', data, {
      timeout: 100000,
    });
    return res.data.data!;
  },

  createChatSession: async (data: CreateChatSessionReq): Promise<ChatSessionRes> => {
    const res = await api.post<APIResponse<ChatSessionRes>>('/ai/chat/sessions', data);
    return res.data.data!;
  },

  sendChatMessageStream: async (
    contextID: string,
    message: string,
    onChunk: (text: string) => void,
    onDone: (fullText: string) => void,
    onError: (error: Error) => void,
    signal?: AbortSignal
  ) => {
    try {
      const response = await fetch(`/api/v1/ai/chat/sessions/${contextID}/messages/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        credentials: 'include',
        body: JSON.stringify({ content: message }),
        signal,
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.message || 'Không thể kết nối đến máy chủ AI');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No readable stream available');

      const decoder = new TextDecoder();
      let buffer = '';
      let currentEvent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed === '') continue;

          if (trimmed.startsWith('event:')) {
            currentEvent = trimmed.replace('event:', '').trim();
          } else if (trimmed.startsWith('data:')) {
            const rawData = trimmed.replace('data:', '').trim();
            let textChunk = '';
            try {
              textChunk = JSON.parse(rawData);
            } catch {
              textChunk = rawData;
            }

            if (currentEvent === 'chunk') {
              onChunk(textChunk);
            } else if (currentEvent === 'done') {
              onDone(textChunk);
              break;
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Ignored, user canceled
      } else {
        onError(error instanceof Error ? error : new Error('Unknown error'));
      }
    }
  },
};
