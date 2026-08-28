import { Injectable } from '@nestjs/common';
import { AbdmCredentialsService } from './abdm-credentials.service';
import { AbdmHttpGateway } from './abdm-http.gateway';
import { MockAbdmGateway } from './mock-abdm.gateway';
import { AbdmGateway, AbdmScope } from './abdm-types';

/**
 * Per-request gateway selection (issue #96 semantics, now living in the
 * connector): a tenant/facility with stored credentials talks to the live NHA
 * gateway; one without gets the fully-exercisable mock. Every response over
 * the internal API is stamped with the gateway that served it, so the
 * clinical side can badge mock flows without holding any ABDM state.
 */
@Injectable()
export class AbhaService {
  constructor(
    private readonly credentials: AbdmCredentialsService,
    private readonly liveGateway: AbdmHttpGateway,
    private readonly mockGateway: MockAbdmGateway,
  ) {}

  async gateway(scope: AbdmScope): Promise<AbdmGateway> {
    return (await this.credentials.hasCredentials(scope)) ? this.liveGateway : this.mockGateway;
  }

  async gatewayName(scope: AbdmScope): Promise<string> {
    return (await this.gateway(scope)).name;
  }

  /**
   * Activation health check: credential resolution plus (when live) the
   * side-effect-free gateway session handshake.
   */
  async healthCheck(scope: AbdmScope): Promise<{
    status: 'ok' | 'mock' | 'error';
    gateway: string;
    detail?: string;
  }> {
    const creds = await this.credentials.getCredentials(scope);
    if (!creds) {
      return { status: 'mock', gateway: this.mockGateway.name };
    }
    try {
      await this.liveGateway.checkSession(scope);
      return { status: 'ok', gateway: this.liveGateway.name };
    } catch (error) {
      return {
        status: 'error',
        gateway: this.liveGateway.name,
        detail: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
