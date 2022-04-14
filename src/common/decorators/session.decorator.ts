import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../database/entity/user.entity';

export const SessionData = createParamDecorator((_, ctx: ExecutionContext) => {
    const  request = ctx.switchToHttp().getRequest();
    return request.user as SessionDto;
});

export class SessionDto {
    constructor(
        public id?: string,
        public user?: UserEntity,
    ) {}
}