import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestContextModule } from 'nestjs-request-context';
import { UserEntity } from './entity/user.entity';
import { GraphqlService } from './graphql/graphql.service';
import { Repo } from './repo.service';

@Global()
@Module({
    imports: [
        // Load entity
        TypeOrmModule.forFeature([
            UserEntity
        ]),

        // Context
        RequestContextModule,
    ],
    providers: [Repo, GraphqlService],
    exports: [Repo]
})
export class RepoModule {}