import { ContributorsUtil } from './../../contributors/contributors.util';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configurations } from '../../../app/configurations';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly contributorsUtil: ContributorsUtil,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configurations.jwt.secret,
    });
  }

  async validate(payload): Promise<any> {
    const user = await this.usersService.findOneBy({ userId: payload?.id });
    if (!user) throw new UnauthorizedException('Invalid user');

    /** Check permission contributor */
    const { contributor } =
      await this.contributorsUtil.getAuthorizationToContributor({
        userId: user?.id,
        organizationId: user?.organizationInUtilizationId,
      });
    if (!contributor) throw new UnauthorizedException('Invalid organization');

    return user;
  }
}
