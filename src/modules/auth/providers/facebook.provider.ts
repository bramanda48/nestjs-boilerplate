import { BadRequestException } from '@nestjs/common';
import { IAuthServiceProvider } from "../../../common/interfaces/auth-service-providers.interface";

export class FacebookProvider implements IAuthServiceProvider {

    getUser(code: string): Promise<{ id: string; name: string; email: string; picture: string; }> {
        throw new BadRequestException(FacebookProvider.name+": Method not implemented.");
    }
}