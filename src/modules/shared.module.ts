import { Module } from '@nestjs/common';
import { RepoModule } from '../database/repo.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        RepoModule,
        UserModule,
    ],
    controllers: [],
    providers: [],
})
export class SharedModule {}
