import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { UserModule } from './user/user.module';
import { RepoModule } from '../database/repo.module';

@Module({
    imports: [
        RepoModule,
        UserModule,
        AuthModule,
        NotificationModule
    ],
    controllers: [],
    providers: [],
})
export class SharedModule {}
