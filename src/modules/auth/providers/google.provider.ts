import { IAuthServiceProvider } from "../../../common/interfaces/auth-service-providers.interface";

export class GoogleProvider implements IAuthServiceProvider  {

    getUser(code: string): Promise<{ id: string; name: string; email: string; picture: string; }> {
        throw new Error(GoogleProvider.name+": Method not implemented.");
    }
}