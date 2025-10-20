import { Injectable } from '@nestjs/common';

@Injectable()
export class MfaService {
  async getMfaStatus(userId: string): Promise<{ enabled: boolean; methods: any[] }> {
    void userId;
    // TODO: replace with real MFA status lookup
    return {
      enabled: false,
      methods: [],
    };
  }

  async verifyMfa(data: any): Promise<{ success: boolean }> {
    void data;
    // TODO: replace with real MFA verification
    return { success: true };
  }
}
