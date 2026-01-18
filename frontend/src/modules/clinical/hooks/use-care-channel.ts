import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { careChannelService } from '@/modules/clinical/services/care-channel-service';
import type {
  CareChannel,
  CareChannelMember,
  ChannelTimelineResponse,
  PostChannelMessageInput,
} from '@/modules/clinical/types/care-channel';

const CARE_CHANNEL_KEYS = {
  channelByAdmission: (admissionId: string) => ['care-channel', 'admission', admissionId] as const,
  members: (channelId: string, includeHistory?: boolean) =>
    ['care-channel', 'members', channelId, includeHistory] as const,
  timeline: (channelId: string, params: Record<string, unknown>) =>
    ['care-channel', 'timeline', channelId, params] as const,
};

export function useCareChannelByAdmission(admissionId: string) {
  return useQuery<CareChannel>({
    queryKey: CARE_CHANNEL_KEYS.channelByAdmission(admissionId),
    queryFn: () => careChannelService.getChannelByAdmission(admissionId),
    enabled: !!admissionId,
  });
}

export function useCareChannelMembers(channelId: string, includeHistory?: boolean) {
  return useQuery<CareChannelMember[]>({
    queryKey: CARE_CHANNEL_KEYS.members(channelId, includeHistory),
    queryFn: () => careChannelService.getMembers(channelId, includeHistory),
    enabled: !!channelId,
  });
}

export function useCareChannelTimeline(
  channelId: string,
  params: {
    limit?: number;
    offset?: number;
    messageType?: string;
    messageSubtype?: string;
    since?: string;
    search?: string;
  },
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  return useQuery<ChannelTimelineResponse>({
    queryKey: CARE_CHANNEL_KEYS.timeline(channelId, params),
    queryFn: () => careChannelService.getTimeline(channelId, params),
    enabled: Boolean(channelId) && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval,
    placeholderData: keepPreviousData,
  });
}

export function usePostCareChannelMessage(channelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PostChannelMessageInput) =>
      careChannelService.postMessage(channelId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['care-channel', 'timeline', channelId],
        exact: false,
      });
    },
  });
}

export function useSyncCareChannelMembers(channelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => careChannelService.syncMembers(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['care-channel', 'members', channelId],
        exact: false,
      });
    },
  });
}

export function useAddCareChannelMember(channelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { staffId: string; memberRole: string }) =>
      careChannelService.addMember(channelId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['care-channel', 'members', channelId],
        exact: false,
      });
    },
  });
}

export function useRemoveCareChannelMember(channelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, removalReason }: { memberId: string; removalReason?: string }) =>
      careChannelService.removeMember(channelId, memberId, removalReason),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['care-channel', 'members', channelId],
        exact: false,
      });
    },
  });
}
