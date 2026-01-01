/**
 * OIDC Authentication Strategy
 * Replaces Express Passport OIDC configuration
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-openidconnect';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OidcStrategy extends PassportStrategy(Strategy, 'oidc') {
  // @ts-ignore - configService is used in super() call
  constructor(private configService: ConfigService) {
    super({
      issuer: configService.get<string>('oidc.issuer'),
      clientID: configService.get<string>('oidc.clientId'),
      clientSecret: configService.get<string>('oidc.clientSecret'),
      authorizationURL: `${configService.get<string>('oidc.issuer')}/authorize`,
      tokenURL: `${configService.get<string>('oidc.issuer')}/token`,
      userInfoURL: `${configService.get<string>('oidc.issuer')}/userinfo`,
      callbackURL: configService.get<string>('oidc.callbackUrl'),
      scope: ['openid', 'profile', 'email'],
    });
  }

  async validate(
    _issuer: string,
    profile: any,
    _idProfile: any,
    _accessToken: string,
    _refreshToken: string,
    params: any,
    _done: (error: any, user?: any) => void,
  ): Promise<any> {
    try {
      // Extract user info from ID token
      const user = {
        id: profile.id,
        displayName: profile.displayName,
        emails: profile.emails,
        ...params,
      };

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid OIDC token');
    }
  }
}
