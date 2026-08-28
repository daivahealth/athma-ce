import { All, Controller, Get, HttpCode, Param, Put, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { CallbackService } from './callback.service';
import { AbdmCallbackVerifier } from './callback-verifier';
import { InternalApiKeyGuard } from '../../common/guards/internal-api-key.guard';

/**
 * The single public ingress for ABDM gateway callbacks. ABDM's protocol is
 * async: our outbound requests get a 202, and results arrive here later.
 *
 * Always answers 202 regardless of outcome — a callback that fails
 * verification or cannot be resolved to a tenant is quarantined for operator
 * triage, never processed and never leaked to the caller via the status code.
 */
@Controller('callbacks/abdm/v3')
export class CallbackController {
  constructor(
    private readonly callbackService: CallbackService,
    private readonly verifier: AbdmCallbackVerifier,
  ) {}

  @All(['', '*'])
  @HttpCode(202)
  async receive(@Req() req: Request): Promise<{ accepted: true }> {
    const callback = {
      path: req.path,
      headers: req.headers,
      body: req.body,
    };

    const verification = this.verifier.verify(req);
    if (!verification.ok) {
      await this.callbackService.quarantine(callback, 'verification_failed', verification.reason);
      return { accepted: true };
    }

    try {
      await this.callbackService.handle(callback);
    } catch (error) {
      await this.callbackService.quarantine(
        callback,
        'malformed',
        error instanceof Error ? error.message : String(error),
      );
    }
    return { accepted: true };
  }
}

/** Operator surface for the quarantine queue (see the ABDM connector runbook). */
@Controller('internal/quarantine')
@UseGuards(InternalApiKeyGuard)
export class QuarantineController {
  constructor(private readonly callbackService: CallbackService) {}

  @Get()
  async list() {
    return { success: true, data: await this.callbackService.listQuarantined() };
  }

  @Put(':id/resolve')
  async resolve(@Param('id') id: string, @Req() req: Request) {
    const resolvedBy = (req.headers['x-service-name'] as string) ?? 'operator';
    return { success: true, data: await this.callbackService.resolveQuarantined(id, resolvedBy) };
  }
}
