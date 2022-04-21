import {
    CanActivate,
    ExecutionContext,
    Injectable,
    SetMetadata,
    UnauthorizedException
    } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { ValidateJwtToken, ValidateJwtTokenVariables } from '../../database/graphql/interfaces';
import { Profile } from '../../database/graphql/interfaces/Profile';
import { ProfileQuery, ValidateJwtTokenQuery } from '../../database/graphql/query';
import { Repo } from '../../database/repo.service';
import { TokenType } from '../dto/token-type.dto';

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(
        private readonly repo: Repo,
    ) { }

    async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const bearer: string  = request.headers.authorization.replace('Bearer ', '');

            // Check raw token
            if(isEmpty(bearer)) {
                throw new UnauthorizedException();
            }

            // Set authorizer connection
            this.repo.graphql.setClient('auth', this.repo.config.get('authorizer.issuer'));

            // Validate token
            let queryValidate = await this.repo.graphql.query<
                ValidateJwtToken, 
                ValidateJwtTokenVariables>({
                service: 'auth',
                query: ValidateJwtTokenQuery,
                variables: {
                    param: {
                        token: bearer,
                        token_type: TokenType.AccessToken,
                        roles: null
                    }
                }
            });
            if(!queryValidate?.data.validate_jwt_token.is_valid) {
                throw new UnauthorizedException();
            }

            // Get profile
            let queryProfile = await this.repo.graphql.query<Profile>({
                service: 'auth',
                query: ProfileQuery
            });
            if(!queryProfile) {
                throw new UnauthorizedException('FAILED_GET_PROFILE');
            }
            let profile  = queryProfile.data.profile;
            request.user = profile;

            // Save roles
            SetMetadata('roles', profile.roles);
            return request;
        } catch(e) {
            throw new UnauthorizedException();
        }
    }
}