import { useQuery } from '@tanstack/react-query';
import { messagesService, type MessageFilters } from '../services/messages-service';
import type { Message } from '../types/message';

const MESSAGE_KEYS = {
  all: ['prm', 'messages'] as const,
  list: (filters: MessageFilters | undefined) => [...MESSAGE_KEYS.all, 'list', filters] as const,
  detail: (messageId: string) => [...MESSAGE_KEYS.all, 'detail', messageId] as const,
};

export function useMessages(filters?: MessageFilters) {
  return useQuery<Message[]>({
    queryKey: MESSAGE_KEYS.list(filters),
    queryFn: () => messagesService.list(filters),
  });
}

export function useMessage(messageId: string) {
  return useQuery<Message>({
    queryKey: MESSAGE_KEYS.detail(messageId),
    queryFn: () => messagesService.get(messageId),
    enabled: !!messageId,
  });
}
