import { clinicalClient } from '@/lib/api/client';
import type {
  CareChannel,
  CareChannelMember,
  ChannelTimelineResponse,
  PostChannelMessageInput,
} from '@/modules/clinical/types/care-channel';

class CareChannelService {
  async getChannelByAdmission(admissionId: string): Promise<CareChannel> {
    const response = await clinicalClient.get(`/inpatient/channels/${admissionId}/by-admission`);
    return response.data;
  }

  async getMembers(channelId: string, includeHistory?: boolean): Promise<CareChannelMember[]> {
    const response = await clinicalClient.get(`/inpatient/channels/${channelId}/members`, {
      params: { includeHistory },
    });
    return response.data;
  }

  async syncMembers(channelId: string): Promise<void> {
    await clinicalClient.post(`/inpatient/channels/${channelId}/members/sync`);
  }

  async addMember(
    channelId: string,
    payload: { staffId: string; memberRole: string }
  ): Promise<CareChannelMember> {
    const response = await clinicalClient.post(`/inpatient/channels/${channelId}/members`, payload);
    return response.data;
  }

  async removeMember(channelId: string, memberId: string, removalReason?: string): Promise<void> {
    await clinicalClient.delete(`/inpatient/channels/${channelId}/members/${memberId}`, {
      data: { removalReason },
    });
  }

  async getTimeline(
    channelId: string,
    params: {
      limit?: number;
      offset?: number;
      messageType?: string;
      messageSubtype?: string;
      since?: string;
      search?: string;
    }
  ): Promise<ChannelTimelineResponse> {
    const response = await clinicalClient.get(`/inpatient/channels/${channelId}/messages`, {
      params,
    });
    return response.data;
  }

  async postMessage(channelId: string, payload: PostChannelMessageInput) {
    const response = await clinicalClient.post(`/inpatient/channels/${channelId}/messages`, payload);
    return response.data;
  }
}

export const careChannelService = new CareChannelService();
