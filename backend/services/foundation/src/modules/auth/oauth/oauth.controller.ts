import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { Public } from '../decorators/public.decorator';
import { AuthService } from '../services/auth.service';
import { OAuthFlowError, OAuthService } from './oauth.service';

function clientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim();
  return first || req.ip || 'unknown';
}

/**
 * External sign-in (Google, Microsoft, GitHub). See
 * docs/api/API-AUTHENTICATION-CONTEXT.md (External sign-in) and ADR-0016.
 */
@ApiTags('Authentication')
@Controller('auth/oauth')
export class OAuthController {
  constructor(
    private readonly oauth: OAuthService,
    private readonly authService: AuthService,
  ) {}

  @Get('providers')
  @Public()
  @ApiOperation({ summary: 'External sign-in providers enabled on this instance' })
  providers() {
    return { providers: this.oauth.enabledProviders(), termsVersion: this.oauth.termsVersion() };
  }

  @Get(':provider/start')
  @Public()
  @ApiOperation({ summary: 'Start external sign-in; redirects to the provider' })
  async start(
    @Param('provider') provider: string,
    @Query('returnTo') returnTo: string | undefined,
    @Query('locale') locale: string | undefined,
    @Query('acceptTerms') acceptTerms: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const result = await this.oauth.start(provider, { returnTo, locale, acceptTerms, ip: clientIp(req) });
      res.setHeader('Set-Cookie', result.cookie);
      res.setHeader('Cache-Control', 'no-store');
      res.redirect(302, result.redirectUrl);
    } catch (error) {
      const code = error instanceof OAuthFlowError ? error.code : 'provider_error';
      res.redirect(302, this.oauth.frontendErrorUrl(code, locale));
    }
  }

  @Get(':provider/callback')
  @Public()
  @ApiOperation({ summary: 'Provider redirect target; redirects to the frontend with a one-time ticket' })
  async callback(
    @Param('provider') provider: string,
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') error: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const target = await this.oauth.callback(provider, {
      code,
      state,
      error,
      cookieHeader: req.headers.cookie,
      ip: clientIp(req),
    });
    res.setHeader('Set-Cookie', this.oauth.clearCookie());
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.redirect(302, target);
  }

  @Post('exchange')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exchange a one-time sign-in ticket for access and refresh tokens' })
  async exchange(@Body() body: { ticket?: string }) {
    try {
      const user = await this.oauth.consumeTicket(body?.ticket);
      return this.authService.issueSession({ id: user.userId, tenantId: user.tenantId });
    } catch (error) {
      if (error instanceof OAuthFlowError) throw new UnauthorizedException('Sign-in link expired or already used');
      throw error;
    }
  }
}
