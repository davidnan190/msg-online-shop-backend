import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../payload/jwt.payload';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
    } as StrategyOptions);
  }

  validate(payload: JwtPayload) {
    if (!payload) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
