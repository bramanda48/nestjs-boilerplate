import { Global, Module } from '@nestjs/common';
import { RepoModule } from 'src/database';
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
