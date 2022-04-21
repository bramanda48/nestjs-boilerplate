import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RepoModule } from '../database/repo.module';

@Module({
    imports: [
        RepoModule,
        AuthModule,
        UserModule,
    ],
    controllers: [],
    providers: [],
})
export class SharedModule {}
