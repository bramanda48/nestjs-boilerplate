import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repo } from '../../database/repo.service';
import { SessionDto } from '../decorators/session.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly repo: Repo,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('auth.jwt.secret'),
        });
    }
    
    async validate(payload: JwtPayload) {
        if(!payload.type.includes('login')) {
            throw new UnauthorizedException();
        }
        let getCache: SessionDto = await this.repo.cacheManager.get<SessionDto>(payload.sub);
        if(!getCache) {
            throw new UnauthorizedException('SESSION_EXPIRED')
        }
        return getCache;
    }
}
